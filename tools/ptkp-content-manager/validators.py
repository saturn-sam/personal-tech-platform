from __future__ import annotations

from datetime import date
from pathlib import Path
import re
from typing import Any

from config import ManagerPaths
from models import CollectionSpec, ContentEntry, FieldSpec, GeneratedContent, RepositoryInspection, ValidationIssue
from utils import ManagerError, parse_date_value, repo_relative, validate_url

INTERNAL_LINK_PATTERN = re.compile(r"\[[^\]]+\]\((/[^)#]+(?:#[^)]+)?)\)")


def validate_generated_content(
    paths: ManagerPaths, generated: GeneratedContent, repository: RepositoryInspection
) -> tuple[ValidationIssue, ...]:
    issues = list(validate_frontmatter(generated.frontmatter, generated.collection, generated.path))
    issues.extend(validate_duplicate_creation(generated, repository))
    issues.extend(validate_reference_issues(paths, generated.path, generated.collection, generated.frontmatter, "", repository))
    issues.extend(validate_image_issues(paths, generated.path, generated.frontmatter))

    return tuple(issues)


def validate_repository_state(paths: ManagerPaths, repository: RepositoryInspection) -> tuple[ValidationIssue, ...]:
    issues: list[ValidationIssue] = []

    for entry in repository.entries:
        collection = repository.collections[entry.collection]
        issues.extend(validate_frontmatter(entry.frontmatter, collection, entry.path))
        issues.extend(validate_reference_issues(paths, entry.path, collection, entry.frontmatter, entry.body, repository))
        issues.extend(validate_image_issues(paths, entry.path, entry.frontmatter))

    issues.extend(validate_duplicate_slugs(repository))
    issues.extend(validate_duplicate_titles(repository))

    return tuple(issues)


def validate_frontmatter(
    frontmatter: dict[str, Any], collection: CollectionSpec, path: Path
) -> tuple[ValidationIssue, ...]:
    issues: list[ValidationIssue] = []

    for field in collection.fields:
        issues.extend(validate_field(frontmatter, field, path, field.name))

    issues.extend(validate_date_relationships(frontmatter, collection, path))

    return tuple(issues)


def validate_field(
    container: dict[str, Any], field: FieldSpec, path: Path, field_path: str
) -> list[ValidationIssue]:
    if field.name not in container:
        if field.required and field.default is None:
            return [ValidationIssue("error", f"Missing required field '{field_path}'.", path)]
        return []

    value = container[field.name]

    if value is None:
        if field.required and field.default is None:
            return [ValidationIssue("error", f"Field '{field_path}' cannot be null.", path)]
        return []

    issues: list[ValidationIssue] = []

    if field.kind in {"string", "url", "enum", "literal"} and isinstance(value, str):
        if not value.strip():
            issues.append(ValidationIssue("error", f"Field '{field_path}' cannot be empty.", path))

    if field.kind == "string":
        issues.extend(validate_string_field(value, field, path, field_path))
    elif field.kind == "url":
        issues.extend(validate_url_field(value, field, path, field_path))
    elif field.kind == "enum":
        issues.extend(validate_enum_field(value, field, path, field_path))
    elif field.kind == "literal":
        issues.extend(validate_literal_field(value, field, path, field_path))
    elif field.kind == "boolean":
        if not isinstance(value, bool):
            issues.append(ValidationIssue("error", f"Field '{field_path}' must be a boolean.", path))
    elif field.kind == "date":
        issues.extend(validate_date_field(value, path, field_path))
    elif field.kind == "number":
        issues.extend(validate_number_field(value, field, path, field_path))
    elif field.kind == "array":
        issues.extend(validate_array_field(value, field, path, field_path))
    elif field.kind == "object":
        issues.extend(validate_object_field(value, field, path, field_path))

    return issues


def validate_string_field(value: Any, field: FieldSpec, path: Path, field_path: str) -> list[ValidationIssue]:
    if not isinstance(value, str):
        return [ValidationIssue("error", f"Field '{field_path}' must be a string.", path)]

    issues: list[ValidationIssue] = []

    if field.max_length is not None and len(value.strip()) > field.max_length:
        issues.append(
            ValidationIssue(
                "error",
                f"Field '{field_path}' exceeds the maximum length of {field.max_length}.",
                path,
            )
        )

    if field.pattern is not None and not re.fullmatch(field.pattern, value.strip()):
        issues.append(
            ValidationIssue(
                "error",
                f"Field '{field_path}' does not match the expected pattern.",
                path,
            )
        )

    if field.starts_with is not None and not value.startswith(field.starts_with):
        issues.append(
            ValidationIssue(
                "error",
                f"Field '{field_path}' must start with '{field.starts_with}'.",
                path,
            )
        )

    return issues


def validate_url_field(value: Any, field: FieldSpec, path: Path, field_path: str) -> list[ValidationIssue]:
    if not isinstance(value, str):
        return [ValidationIssue("error", f"Field '{field_path}' must be a URL string.", path)]

    issues = validate_string_field(value, field, path, field_path)

    if not validate_url(value):
        issues.append(ValidationIssue("error", f"Field '{field_path}' must be a valid URL.", path))

    return issues


def validate_enum_field(value: Any, field: FieldSpec, path: Path, field_path: str) -> list[ValidationIssue]:
    if not isinstance(value, str):
        return [ValidationIssue("error", f"Field '{field_path}' must be a string enum.", path)]

    if value not in field.enum_values:
        return [
            ValidationIssue(
                "error",
                f"Field '{field_path}' must be one of: {', '.join(field.enum_values)}.",
                path,
            )
        ]

    return []


def validate_literal_field(value: Any, field: FieldSpec, path: Path, field_path: str) -> list[ValidationIssue]:
    if value != field.literal_value:
        return [
            ValidationIssue(
                "error",
                f"Field '{field_path}' must equal {field.literal_value!r}.",
                path,
            )
        ]

    return []


def validate_date_field(value: Any, path: Path, field_path: str) -> list[ValidationIssue]:
    try:
        parse_date_value(value)
    except ValueError as error:
        return [ValidationIssue("error", f"Field '{field_path}' has an invalid date: {error}.", path)]

    return []


def validate_number_field(value: Any, field: FieldSpec, path: Path, field_path: str) -> list[ValidationIssue]:
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        return [ValidationIssue("error", f"Field '{field_path}' must be numeric.", path)]

    issues: list[ValidationIssue] = []

    if field.integer and not isinstance(value, int):
        issues.append(ValidationIssue("error", f"Field '{field_path}' must be an integer.", path))

    if field.positive and value <= 0:
        issues.append(ValidationIssue("error", f"Field '{field_path}' must be positive.", path))

    return issues


def validate_array_field(value: Any, field: FieldSpec, path: Path, field_path: str) -> list[ValidationIssue]:
    if not isinstance(value, list):
        return [ValidationIssue("error", f"Field '{field_path}' must be an array.", path)]

    issues: list[ValidationIssue] = []

    if field.min_items is not None and len(value) < field.min_items:
        issues.append(
            ValidationIssue(
                "error",
                f"Field '{field_path}' must contain at least {field.min_items} item(s).",
                path,
            )
        )

    if field.item_spec:
        item_spec = field.item_spec

        for index, item in enumerate(value):
            if item_spec.kind == "object":
                issues.extend(validate_object_value(item, item_spec, path, f"{field_path}[{index}]"))
            else:
                issues.extend(validate_scalar_value(item, item_spec, path, f"{field_path}[{index}]"))

    return issues


def validate_object_field(value: Any, field: FieldSpec, path: Path, field_path: str) -> list[ValidationIssue]:
    return validate_object_value(value, field, path, field_path)


def validate_object_value(value: Any, field: FieldSpec, path: Path, field_path: str) -> list[ValidationIssue]:
    if not isinstance(value, dict):
        return [ValidationIssue("error", f"Field '{field_path}' must be an object.", path)]

    issues: list[ValidationIssue] = []

    for nested_field in field.fields:
        issues.extend(validate_field(value, nested_field, path, f"{field_path}.{nested_field.name}"))

    return issues


def validate_scalar_value(value: Any, field: FieldSpec, path: Path, field_path: str) -> list[ValidationIssue]:
    pseudo_container = {field.name: value}
    return validate_field(pseudo_container, field, path, field_path)


def validate_date_relationships(
    frontmatter: dict[str, Any], collection: CollectionSpec, path: Path
) -> tuple[ValidationIssue, ...]:
    issues: list[ValidationIssue] = []

    published_date = safely_parse_date(frontmatter.get("publishedDate"))
    updated_date = safely_parse_date(frontmatter.get("updatedDate"))
    reviewed_date = safely_parse_date(frontmatter.get("reviewedDate"))

    if published_date and updated_date and updated_date < published_date:
        issues.append(
            ValidationIssue(
                "error",
                "updatedDate cannot be earlier than publishedDate.",
                path,
            )
        )

    if published_date and reviewed_date and reviewed_date < published_date:
        issues.append(
            ValidationIssue(
                "error",
                "reviewedDate cannot be earlier than publishedDate.",
                path,
            )
        )

    if collection.name == "projects":
        start_date = safely_parse_date(frontmatter.get("startDate"))
        end_date = safely_parse_date(frontmatter.get("endDate"))

        if start_date and end_date and end_date < start_date:
            issues.append(
                ValidationIssue("error", "endDate cannot be earlier than startDate.", path)
            )

    if collection.name == "certifications":
        certification_date = safely_parse_date(frontmatter.get("certificationDate"))
        expiration_date = safely_parse_date(frontmatter.get("expirationDate"))

        if certification_date and expiration_date and expiration_date < certification_date:
            issues.append(
                ValidationIssue(
                    "error",
                    "expirationDate cannot be earlier than certificationDate.",
                    path,
                )
            )

    return tuple(issues)


def validate_duplicate_creation(
    generated: GeneratedContent, repository: RepositoryInspection
) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    collection_entries = repository.entries_for_collection(generated.collection.name)
    generated_slug = str(generated.frontmatter.get("slug", "")).casefold()
    generated_title = str(generated.frontmatter.get("title", "")).casefold()

    if generated.path.exists():
        issues.append(
            ValidationIssue("error", f"Target file already exists: {generated.path.name}.", generated.path)
        )

    if any(entry.slug.casefold() == generated_slug for entry in collection_entries):
        issues.append(
            ValidationIssue(
                "error",
                f"Slug '{generated.frontmatter.get('slug')}' already exists in {generated.collection.label}.",
                generated.path,
            )
        )

    if any(entry.title.casefold() == generated_title for entry in collection_entries):
        issues.append(
            ValidationIssue(
                "warning",
                f"Title '{generated.frontmatter.get('title')}' already exists in {generated.collection.label}.",
                generated.path,
            )
        )

    return issues


def validate_duplicate_slugs(repository: RepositoryInspection) -> tuple[ValidationIssue, ...]:
    issues: list[ValidationIssue] = []

    for slug, entries in repository.slug_lookup().items():
        if len(entries) > 1:
            issue_paths = ", ".join(repo_relative(entry.path, entry.path.parents[2]) for entry in entries)
            issues.append(
                ValidationIssue(
                    "warning",
                    f"Duplicate slug '{slug}' found across collections: {issue_paths}.",
                    entries[0].path,
                )
            )

    return tuple(issues)


def validate_duplicate_titles(repository: RepositoryInspection) -> tuple[ValidationIssue, ...]:
    issues: list[ValidationIssue] = []

    for title, entries in repository.title_lookup().items():
        if len(entries) > 1:
            issue_paths = ", ".join(repo_relative(entry.path, entry.path.parents[2]) for entry in entries)
            issues.append(
                ValidationIssue(
                    "warning",
                    f"Duplicate title '{title}' found across collections: {issue_paths}.",
                    entries[0].path,
                )
            )

    return tuple(issues)


def validate_reference_issues(
    paths: ManagerPaths,
    path: Path,
    collection: CollectionSpec,
    frontmatter: dict[str, Any],
    body: str,
    repository: RepositoryInspection,
) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    entry_lookup = repository.entry_lookup()

    for reference in frontmatter.get("relatedAssets", []):
        issues.extend(validate_asset_reference(path, reference, entry_lookup, "relatedAssets"))

    if collection.name == "learning-paths":
        for index, step in enumerate(frontmatter.get("steps", [])):
            asset = step.get("asset") if isinstance(step, dict) else None
            issues.extend(validate_asset_reference(path, asset, entry_lookup, f"steps[{index}].asset"))

    issues.extend(validate_internal_links(body, path, repository))

    return issues


def validate_asset_reference(
    path: Path,
    reference: Any,
    entry_lookup: dict[tuple[str, str], ContentEntry],
    field_path: str,
) -> list[ValidationIssue]:
    if not isinstance(reference, dict):
        return [ValidationIssue("error", f"{field_path} must contain object references.", path)]

    collection = reference.get("collection")
    slug = reference.get("slug")

    if not isinstance(collection, str) or not isinstance(slug, str):
        return [ValidationIssue("error", f"{field_path} must include collection and slug.", path)]

    if (collection, slug) not in entry_lookup:
        return [
            ValidationIssue(
                "warning",
                f"{field_path} points to missing content: {collection}/{slug}.",
                path,
            )
        ]

    return []


def validate_internal_links(
    body: str, path: Path, repository: RepositoryInspection
) -> list[ValidationIssue]:
    if not body:
        return []

    routable_paths = build_routable_paths(repository)
    issues: list[ValidationIssue] = []

    for match in INTERNAL_LINK_PATTERN.finditer(body):
        raw_target = match.group(1)
        target = raw_target.split("#", 1)[0]

        if not target.startswith("/"):
            continue

        normalized = target if target.endswith("/") else f"{target}/"

        if normalized in routable_paths:
            continue

        if not any(normalized.startswith(prefix) for prefix in ("/downloads/", "/assets/", "/search/", "/about/")):
            issues.append(
                ValidationIssue(
                    "warning",
                    f"Internal link target was not found in known content routes: {target}",
                    path,
                )
            )

    return issues


def build_routable_paths(repository: RepositoryInspection) -> set[str]:
    paths = {"/", "/about/", "/search/"}

    for collection_name, spec in repository.collections.items():
        paths.add(spec.route_base)

        for entry in repository.entries_for_collection(collection_name):
            paths.add(f"{spec.route_base}{entry.slug}/")
            seo = entry.frontmatter.get("seo")
            if isinstance(seo, dict):
                canonical = seo.get("canonicalPath")
                if isinstance(canonical, str) and canonical.startswith("/"):
                    paths.add(canonical if canonical.endswith("/") else f"{canonical}/")

    return paths


def validate_image_issues(
    paths: ManagerPaths, path: Path, frontmatter: dict[str, Any]
) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []

    featured_image = frontmatter.get("featuredImage")
    if isinstance(featured_image, dict):
        issues.extend(validate_image_reference(paths, path, featured_image.get("src"), "featuredImage.src"))

    badge = frontmatter.get("badge")
    if isinstance(badge, dict):
        issues.extend(validate_image_reference(paths, path, badge.get("src"), "badge.src"))

    gallery = frontmatter.get("gallery")
    if isinstance(gallery, list):
        for index, image in enumerate(gallery):
            if isinstance(image, dict):
                issues.extend(
                    validate_image_reference(paths, path, image.get("src"), f"gallery[{index}].src")
                )

    return issues


def validate_image_reference(
    paths: ManagerPaths, path: Path, value: Any, field_path: str
) -> list[ValidationIssue]:
    if not isinstance(value, str) or not value.startswith("/"):
        return []

    public_path = paths.root / "public" / value.lstrip("/")

    if public_path.exists():
        return []

    return [ValidationIssue("warning", f"Missing image asset for {field_path}: {value}", path)]


def safely_parse_date(value: Any) -> date | None:
    try:
        return parse_date_value(value)
    except ValueError:
        return None


def raise_for_errors(issues: tuple[ValidationIssue, ...]) -> None:
    errors = [issue for issue in issues if issue.severity == "error"]

    if errors:
        messages = "\n".join(issue.message for issue in errors)
        raise ManagerError(messages)
