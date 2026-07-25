from __future__ import annotations

from dataclasses import replace
from pathlib import Path
import re
from typing import Any

from config import ManagerPaths
from constants import DEFAULT_AUTHOR_FALLBACK, PLACEHOLDER_TITLE_PREFIX
from models import CollectionSpec, ContentEntry, FieldSpec, RepositoryInspection
from utils import ManagerError, as_tuple, load_frontmatter_file

CONTENT_COLLECTION_PATTERN = re.compile(
    r"(?P<key>'[^']+'|[A-Za-z0-9_-]+):\s*createContentCollection\('(?P<directory>[^']+)',\s*(?P<schema>[A-Za-z0-9_]+)\)"
)
COLLECTION_DEFINITION_PATTERN = re.compile(
    r"(?P<key>'[^']+'|[A-Za-z0-9_-]+):\s*\{\s*assetType:\s*'(?P<asset>[^']+)'\s*,\s*label:\s*'(?P<label>[^']+)'\s*,?\s*\}",
    re.S,
)
AUTHOR_PATTERN = re.compile(r"author:\s*'(?P<author>[^']+)'")


def inspect_repository(paths: ManagerPaths) -> RepositoryInspection:
    collection_config = paths.content_config_path.read_text(encoding="utf-8")
    collection_definitions = paths.content_collections_path.read_text(encoding="utf-8")
    relationships = paths.relationships_path.read_text(encoding="utf-8")
    schema_text = paths.content_schema_path.read_text(encoding="utf-8")
    site_config = paths.site_config_path.read_text(encoding="utf-8")

    discovered_collections = parse_collections_from_content_config(collection_config)
    collection_details = parse_collection_details(collection_definitions)
    route_bases = parse_route_bases(relationships)
    author = parse_author(site_config)
    assignments = extract_const_assignments(schema_text)
    schema_cache: dict[str, FieldSpec] = {}
    collection_names = tuple(discovered_collections.keys())

    collections: dict[str, CollectionSpec] = {}

    for collection_name, meta in discovered_collections.items():
        details = collection_details.get(collection_name)

        if not details:
            raise ManagerError(f"Missing collection definition for '{collection_name}'.")

        route_base = route_bases.get(collection_name)

        if not route_base:
            raise ManagerError(f"Missing route base for '{collection_name}'.")

        schema = parse_expression(assignments[meta["schema_name"]], assignments, schema_cache, collection_names)

        if schema.kind != "object":
            raise ManagerError(f"Schema '{meta['schema_name']}' did not resolve to an object.")

        collections[collection_name] = CollectionSpec(
            name=collection_name,
            directory=meta["directory"],
            schema_name=meta["schema_name"],
            asset_type=details["asset_type"],
            label=details["label"],
            route_base=route_base,
            template_name=f"{details['asset_type']}.md",
            fields=schema.fields,
        )

    entries = tuple(scan_content_entries(paths, collections))
    enriched_collections = enrich_collections(collections, entries)

    return RepositoryInspection(
        author=author,
        collections=enriched_collections,
        entries=entries,
    )


def parse_collections_from_content_config(text: str) -> dict[str, dict[str, str]]:
    collections: dict[str, dict[str, str]] = {}

    for match in CONTENT_COLLECTION_PATTERN.finditer(text):
        key = strip_quotes(match.group("key"))
        collections[key] = {
            "directory": match.group("directory"),
            "schema_name": match.group("schema"),
        }

    if not collections:
        raise ManagerError("No Astro content collections were discovered.")

    return collections


def parse_collection_details(text: str) -> dict[str, dict[str, str]]:
    details: dict[str, dict[str, str]] = {}

    for match in COLLECTION_DEFINITION_PATTERN.finditer(text):
        key = strip_quotes(match.group("key"))
        details[key] = {
            "asset_type": match.group("asset"),
            "label": match.group("label"),
        }

    if not details:
        raise ManagerError("No content collection definitions were discovered.")

    return details


def parse_route_bases(text: str) -> dict[str, str]:
    object_text = extract_object_literal_from_assignment(text, "routeBases")
    pairs = parse_object_pairs(object_text)
    route_bases: dict[str, str] = {}

    for key, value in pairs:
        route_bases[strip_quotes(key)] = strip_quotes(value.strip())

    if not route_bases:
        raise ManagerError("No content route bases were discovered.")

    return route_bases


def parse_author(text: str) -> str:
    match = AUTHOR_PATTERN.search(text)
    return match.group("author") if match else DEFAULT_AUTHOR_FALLBACK


def scan_content_entries(paths: ManagerPaths, collections: dict[str, CollectionSpec]) -> list[ContentEntry]:
    entries: list[ContentEntry] = []

    for collection_name, spec in collections.items():
        directory = paths.content_root / spec.directory

        if not directory.exists():
            continue

        for path in sorted(directory.glob("*.mdx")):
            frontmatter, body = load_frontmatter_file(path)
            entries.append(
                ContentEntry(
                    collection=collection_name,
                    path=path,
                    frontmatter=frontmatter,
                    body=body,
                )
            )

    return entries


def enrich_collections(
    collections: dict[str, CollectionSpec], entries: tuple[ContentEntry, ...]
) -> dict[str, CollectionSpec]:
    enriched: dict[str, CollectionSpec] = {}

    for collection_name, spec in collections.items():
        collection_entries = [entry for entry in entries if entry.collection == collection_name]
        placeholder = next(
            (
                entry
                for entry in collection_entries
                if entry.slug.startswith("placeholder-")
                or entry.title.startswith(PLACEHOLDER_TITLE_PREFIX)
            ),
            None,
        )
        suggestions = collect_suggestions(spec, collection_entries)

        enriched[collection_name] = replace(
            spec,
            placeholder_frontmatter=placeholder.frontmatter if placeholder else {},
            placeholder_body=placeholder.body if placeholder else "",
            suggestions=suggestions,
        )

    return enriched


def collect_suggestions(spec: CollectionSpec, entries: list[ContentEntry]) -> dict[str, tuple[str, ...]]:
    suggestions: dict[str, tuple[str, ...]] = {}

    for field in spec.fields:
        values: list[str] = []

        if field.enum_values:
            values.extend(field.enum_values)

        for entry in entries:
            candidate = entry.frontmatter.get(field.name)

            if isinstance(candidate, list) and field.kind == "array":
                values.extend(str(item) for item in candidate if isinstance(item, str))
            elif isinstance(candidate, str) and field.kind in {"enum", "string", "url"}:
                values.append(candidate)

        if values:
            suggestions[field.name] = as_tuple(sorted(values, key=str.casefold))

    return suggestions


def extract_const_assignments(text: str) -> dict[str, str]:
    assignments: dict[str, str] = {}

    for match in re.finditer(r"(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*", text):
        name = match.group(1)
        assignments[name] = extract_assignment_expression(text, match.end())

    return assignments


def extract_assignment_expression(text: str, start_index: int) -> str:
    depth_paren = depth_brace = depth_bracket = 0
    quote: str | None = None
    escape = False
    index = start_index

    while index < len(text):
        character = text[index]

        if quote:
            if escape:
                escape = False
            elif character == "\\":
                escape = True
            elif character == quote:
                quote = None

            index += 1
            continue

        if character in {"'", '"', "`"}:
            quote = character
        elif character == "(":
            depth_paren += 1
        elif character == ")":
            depth_paren -= 1
        elif character == "{":
            depth_brace += 1
        elif character == "}":
            depth_brace -= 1
        elif character == "[":
            depth_bracket += 1
        elif character == "]":
            depth_bracket -= 1
        elif character == ";" and depth_paren == 0 and depth_brace == 0 and depth_bracket == 0:
            return text[start_index:index].strip()

        index += 1

    raise ManagerError("Failed to extract a TypeScript assignment expression.")


def extract_object_literal_from_assignment(text: str, name: str) -> str:
    match = re.search(rf"(?:const|export\s+const)\s+{re.escape(name)}\s*=\s*", text)

    if not match:
        raise ManagerError(f"Assignment '{name}' was not found.")

    expression = extract_assignment_expression(text, match.end())
    start = expression.find("{")

    if start < 0:
        raise ManagerError(f"Assignment '{name}' does not contain an object literal.")

    end = find_matching(expression, start, "{", "}")
    return expression[start + 1 : end]


def parse_expression(
    expression: str,
    assignments: dict[str, str],
    cache: dict[str, FieldSpec],
    collection_names: tuple[str, ...],
) -> FieldSpec:
    normalized = expression.strip().rstrip(",")
    compact = collapse_layout(normalized)

    extend_position = find_top_level_method(normalized, "extend")

    if extend_position >= 0:
        base_expression = normalized[:extend_position].strip()
        argument, _ = extract_call_from_position(normalized, extend_position + len(".extend"))
        base_spec = parse_expression(base_expression, assignments, cache, collection_names)

        if base_spec.kind != "object":
            raise ManagerError("Only object schemas can be extended.")

        extension_fields = tuple(
            replace(
                parse_expression(value, assignments, cache, collection_names),
                name=strip_quotes(key),
            )
            for key, value in parse_object_pairs(argument)
        )

        return replace(base_spec, fields=merge_fields(base_spec.fields, extension_fields))

    if compact.startswith("z.object("):
        argument, _ = extract_call(normalized, "z.object")
        fields = tuple(
            replace(
                parse_expression(value, assignments, cache, collection_names),
                name=strip_quotes(key),
            )
            for key, value in parse_object_pairs(argument)
        )

        spec = FieldSpec(name="", kind="object", fields=fields)
        return apply_modifiers(spec, normalized, collection_names)

    if compact.startswith("z.array("):
        argument, _ = extract_call(normalized, "z.array")
        inner_expression = argument.strip().rstrip(",")
        item_spec = parse_expression(inner_expression, assignments, cache, collection_names)
        spec = FieldSpec(name="", kind="array", item_spec=item_spec)
        return apply_modifiers(spec, normalized, collection_names)

    if compact.startswith("z.enum("):
        argument, _ = extract_call(normalized, "z.enum")
        values = collection_names if argument.strip() == "contentCollectionNames" else tuple(parse_string_array(argument))
        spec = FieldSpec(name="", kind="enum", enum_values=values)
        return apply_modifiers(spec, normalized, collection_names)

    if compact.startswith("z.literal("):
        argument, _ = extract_call(normalized, "z.literal")
        spec = FieldSpec(name="", kind="literal", literal_value=parse_scalar(argument.strip()))
        return apply_modifiers(spec, normalized, collection_names)

    if compact.startswith("z.coerce.date(") or compact.startswith("z.date("):
        return apply_modifiers(FieldSpec(name="", kind="date"), normalized, collection_names)

    if compact.startswith("z.url("):
        return apply_modifiers(FieldSpec(name="", kind="url"), normalized, collection_names)

    if compact.startswith("z.string("):
        return apply_modifiers(FieldSpec(name="", kind="string"), normalized, collection_names)

    if compact.startswith("z.number("):
        return apply_modifiers(FieldSpec(name="", kind="number"), normalized, collection_names)

    if compact.startswith("z.boolean("):
        return apply_modifiers(FieldSpec(name="", kind="boolean"), normalized, collection_names)

    identifier = top_level_identifier(normalized)

    if identifier in cache:
        return apply_modifiers(cache[identifier], normalized, collection_names)

    if identifier in assignments:
        parsed = parse_expression(assignments[identifier], assignments, cache, collection_names)
        cache[identifier] = parsed
        return apply_modifiers(parsed, normalized, collection_names)

    raise ManagerError(f"Unsupported schema expression: {normalized}")


def apply_modifiers(
    base_spec: FieldSpec, expression: str, collection_names: tuple[str, ...]
) -> FieldSpec:
    required = base_spec.required
    default = base_spec.default
    min_items = base_spec.min_items
    max_length = base_spec.max_length
    pattern = base_spec.pattern
    starts_with = base_spec.starts_with
    integer = base_spec.integer
    positive = base_spec.positive

    if ".optional()" in expression:
        required = False

    default_argument = extract_method_argument(expression, "default")
    if default_argument is not None:
        default = parse_scalar(default_argument)
        required = False

    min_argument = extract_method_argument(expression, "min")
    if min_argument is not None:
        value = int(parse_scalar(min_argument))
        if base_spec.kind == "array":
            min_items = value

    max_argument = extract_method_argument(expression, "max")
    if max_argument is not None and base_spec.kind in {"string", "url"}:
        max_length = int(parse_scalar(max_argument))

    if ".int()" in expression:
        integer = True

    if ".positive()" in expression:
        positive = True

    starts_with_argument = extract_method_argument(expression, "startsWith")
    if starts_with_argument is not None:
        starts_with = str(parse_scalar(starts_with_argument))

    regex_argument = extract_regex_argument(expression)
    if regex_argument is not None:
        pattern = regex_argument

    if base_spec.kind == "enum" and base_spec.enum_values == ("contentCollectionNames",):
        base_spec = replace(base_spec, enum_values=collection_names)

    return replace(
        base_spec,
        required=required,
        default=default,
        min_items=min_items,
        max_length=max_length,
        pattern=pattern,
        starts_with=starts_with,
        integer=integer,
        positive=positive,
    )


def merge_fields(base_fields: tuple[FieldSpec, ...], extension_fields: tuple[FieldSpec, ...]) -> tuple[FieldSpec, ...]:
    merged: list[FieldSpec] = list(base_fields)
    index_by_name = {field.name: index for index, field in enumerate(merged)}

    for field in extension_fields:
        existing_index = index_by_name.get(field.name)
        if existing_index is None:
            index_by_name[field.name] = len(merged)
            merged.append(field)
        else:
            merged[existing_index] = field

    return tuple(merged)


def parse_object_pairs(object_text: str) -> list[tuple[str, str]]:
    stripped_object = object_text.strip()

    if stripped_object.startswith("{") and stripped_object.endswith("}"):
        object_text = stripped_object[1:-1]

    pairs: list[tuple[str, str]] = []

    for item in split_top_level_items(object_text):
        if not item.strip():
            continue

        key, value = split_top_level_pair(item)
        pairs.append((key.strip(), value.strip()))

    return pairs


def split_top_level_items(text: str) -> list[str]:
    items: list[str] = []
    start = 0
    depth_paren = depth_brace = depth_bracket = 0
    quote: str | None = None
    escape = False

    for index, character in enumerate(text):
        if quote:
            if escape:
                escape = False
            elif character == "\\":
                escape = True
            elif character == quote:
                quote = None
            continue

        if character in {"'", '"', "`"}:
            quote = character
        elif character == "(":
            depth_paren += 1
        elif character == ")":
            depth_paren -= 1
        elif character == "{":
            depth_brace += 1
        elif character == "}":
            depth_brace -= 1
        elif character == "[":
            depth_bracket += 1
        elif character == "]":
            depth_bracket -= 1
        elif (
            character == ","
            and depth_paren == 0
            and depth_brace == 0
            and depth_bracket == 0
        ):
            items.append(text[start:index])
            start = index + 1

    tail = text[start:]
    if tail.strip():
        items.append(tail)

    return items


def split_top_level_pair(text: str) -> tuple[str, str]:
    depth_paren = depth_brace = depth_bracket = 0
    quote: str | None = None
    escape = False

    for index, character in enumerate(text):
        if quote:
            if escape:
                escape = False
            elif character == "\\":
                escape = True
            elif character == quote:
                quote = None
            continue

        if character in {"'", '"', "`"}:
            quote = character
        elif character == "(":
            depth_paren += 1
        elif character == ")":
            depth_paren -= 1
        elif character == "{":
            depth_brace += 1
        elif character == "}":
            depth_brace -= 1
        elif character == "[":
            depth_bracket += 1
        elif character == "]":
            depth_bracket -= 1
        elif (
            character == ":"
            and depth_paren == 0
            and depth_brace == 0
            and depth_bracket == 0
        ):
            return text[:index], text[index + 1 :]

    raise ManagerError(f"Failed to split object pair: {text}")


def extract_call(expression: str, function_name: str) -> tuple[str, str]:
    pattern = build_function_pattern(function_name)
    match = re.match(pattern, expression)

    if not match:
        raise ManagerError(f"Expression does not start with {function_name}: {expression}")

    open_index = match.end() - 1
    close_index = find_matching(expression, open_index, "(", ")")
    return expression[open_index + 1 : close_index], expression[close_index + 1 :]


def extract_call_from_position(expression: str, method_index: int) -> tuple[str, str]:
    open_index = expression.find("(", method_index)

    if open_index < 0:
        raise ManagerError(f"Method call is missing parentheses: {expression}")

    close_index = find_matching(expression, open_index, "(", ")")
    return expression[open_index + 1 : close_index], expression[close_index + 1 :]


def extract_method_argument(expression: str, method_name: str) -> str | None:
    method_position = find_top_level_method(expression, method_name)

    if method_position < 0:
        return None

    argument, _ = extract_call_from_position(expression, method_position + len(f".{method_name}"))
    return argument.strip()


def extract_regex_argument(expression: str) -> str | None:
    marker = ".regex("
    start = expression.find(marker)

    if start < 0:
        return None

    index = start + len(marker)

    if index >= len(expression) or expression[index] != "/":
        return None

    index += 1
    escaped = False
    in_character_class = False
    pattern_start = index

    while index < len(expression):
        character = expression[index]

        if escaped:
            escaped = False
        elif character == "\\":
            escaped = True
        elif character == "[":
            in_character_class = True
        elif character == "]" and in_character_class:
            in_character_class = False
        elif character == "/" and not in_character_class:
            return expression[pattern_start:index]

        index += 1

    raise ManagerError(f"Regex literal is not closed: {expression}")


def parse_scalar(value: str) -> Any:
    normalized = value.strip().rstrip(",")

    if normalized.startswith(("'", '"')) and normalized.endswith(("'", '"')):
        return strip_quotes(normalized)

    if normalized == "[]":
        return []

    if normalized == "{}":
        return {}

    if normalized == "true":
        return True

    if normalized == "false":
        return False

    if re.fullmatch(r"\d+", normalized):
        return int(normalized)

    if re.fullmatch(r"\d+\.\d+", normalized):
        return float(normalized)

    return normalized


def parse_string_array(expression: str) -> list[str]:
    stripped = expression.strip()

    if not stripped.startswith("[") or not stripped.endswith("]"):
        raise ManagerError(f"Enum expression is not an array: {expression}")

    values = []

    for item in split_top_level_items(stripped[1:-1]):
        if item.strip():
            values.append(strip_quotes(item.strip()))

    return values


def top_level_identifier(expression: str) -> str:
    expression = expression.strip()
    match = re.match(r"[A-Za-z_][A-Za-z0-9_]*", expression)
    return match.group(0) if match else expression


def find_top_level_method(expression: str, method_name: str) -> int:
    target = f".{method_name}("
    depth_paren = depth_brace = depth_bracket = 0
    quote: str | None = None
    escape = False
    index = 0

    while index < len(expression):
        character = expression[index]

        if quote:
            if escape:
                escape = False
            elif character == "\\":
                escape = True
            elif character == quote:
                quote = None

            index += 1
            continue

        if character in {"'", '"', "`"}:
            quote = character
        elif character == "(":
            depth_paren += 1
        elif character == ")":
            depth_paren -= 1
        elif character == "{":
            depth_brace += 1
        elif character == "}":
            depth_brace -= 1
        elif character == "[":
            depth_bracket += 1
        elif character == "]":
            depth_bracket -= 1
        elif (
            character == "."
            and depth_paren == 0
            and depth_brace == 0
            and depth_bracket == 0
            and expression.startswith(target, index)
        ):
            return index

        index += 1

    return -1


def find_matching(text: str, open_index: int, open_character: str, close_character: str) -> int:
    depth = 0
    quote: str | None = None
    escape = False

    for index in range(open_index, len(text)):
        character = text[index]

        if quote:
            if escape:
                escape = False
            elif character == "\\":
                escape = True
            elif character == quote:
                quote = None
            continue

        if character in {"'", '"', "`"}:
            quote = character
            continue

        if character == open_character:
            depth += 1
        elif character == close_character:
            depth -= 1
            if depth == 0:
                return index

    raise ManagerError(f"Failed to find matching '{close_character}' in expression.")


def strip_quotes(value: str) -> str:
    normalized = value.strip()

    if len(normalized) >= 2 and normalized[0] in {"'", '"', "`"} and normalized[-1] == normalized[0]:
        return normalized[1:-1]

    return normalized


def build_function_pattern(function_name: str) -> str:
    parts = function_name.split(".")
    return r"\s*".join(re.escape(part) for part in parts[:-1]) + rf"\s*\.\s*{re.escape(parts[-1])}\s*\("


def collapse_layout(expression: str) -> str:
    return re.sub(r"\s+", "", expression)
