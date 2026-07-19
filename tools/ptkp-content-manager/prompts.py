from __future__ import annotations

from datetime import date
from typing import Any

import questionary

from models import CollectionSpec, ContentAnswers, RepositoryInspection
from utils import ManagerError, split_csv, today_string, validate_url


def select_content_type(repository: RepositoryInspection) -> CollectionSpec:
    collections = sorted(repository.collections.values(), key=lambda item: item.label.casefold())
    collection_lookup = {collection.name: collection for collection in collections}
    choice = questionary.select(
        "Select content type:",
        choices=[
            questionary.Choice(title=f"{collection.label} ({collection.name})", value=collection.name)
            for collection in collections
        ],
    ).ask()

    return collection_lookup[require_answer(choice)]


def collect_metadata(collection: CollectionSpec, repository: RepositoryInspection) -> ContentAnswers:
    values: dict[str, Any] = {"today": today_string()}
    values["title"] = ask_title()
    values["description"] = ask_description()
    values["summary"] = ask_text(
        "Summary:",
        default=values["description"],
        instruction="Use the description if the summary does not need extra detail.",
    )

    if "difficulty" in collection.field_map():
        values["difficulty"] = ask_select(
            "Difficulty:",
            collection.suggestions.get("difficulty", ("foundational", "intermediate", "advanced")),
        )

    values["tags"] = ask_csv("Tags (comma separated):", required=True)
    values["technologies"] = ask_technologies(repository, required=True)
    values["categories"] = ask_csv_with_suggestions(
        "Categories (comma separated):",
        collection.suggestions.get("categories", ()),
        required=True,
    )
    values["featured"] = ask_confirm("Featured?", default=False)
    values["draft"] = ask_confirm("Create as draft?", default=True)
    values["relatedAssets"] = ask_related_assets(repository)

    collect_collection_specific_metadata(collection, repository, values)

    if collection.name == "learning-paths":
        merge_learning_path_related_assets(values)

    return ContentAnswers(collection=collection, values=values)


def collect_collection_specific_metadata(
    collection: CollectionSpec, repository: RepositoryInspection, values: dict[str, Any]
) -> None:
    asset_type = collection.asset_type

    if asset_type == "article":
        values["series"] = ask_optional_text("Series (optional):")
        return

    if asset_type == "lab-note":
        values["tools"] = ask_csv_with_suggestions(
            "Tools (comma separated, optional):",
            collection.suggestions.get("tools", ()),
            required=False,
        )
        return

    if asset_type == "architecture-guide":
        values["businessContext"] = ask_text("Business context:")
        values["requirements"] = ask_csv("Requirements (comma separated):", required=True)
        values["assumptions"] = ask_csv("Assumptions (comma separated):", required=True)
        values["includeDiagram"] = ask_confirm("Include a Mermaid diagram block?", default=True)
        return

    if asset_type == "project":
        values["projectStatus"] = ask_select(
            "Project status:",
            field_enum(collection, "projectStatus"),
        )
        values["environment"] = ask_text("Environment:")
        values["startDate"] = ask_date("Start date:", default=today_string())
        values["endDate"] = ask_optional_date("End date (optional):")
        values["outcomes"] = ask_csv("Outcomes (comma separated):", required=True)
        values["includeDiagram"] = ask_confirm("Include a Mermaid diagram block?", default=True)
        return

    if asset_type == "technology":
        values["vendor"] = ask_optional_text("Vendor (optional):")
        values["versionInfo"] = ask_optional_text("Version info (optional):")
        values["website"] = ask_optional_url("Official website (optional):")
        values["skillLevel"] = ask_select(
            "Skill level:",
            collection.suggestions.get("skillLevel", ("foundational", "intermediate", "advanced")),
        )
        values["aliases"] = ask_csv_with_suggestions(
            "Aliases (comma separated, optional):",
            collection.suggestions.get("aliases", ()),
            required=False,
        )
        return

    if asset_type == "certification":
        values["issuer"] = ask_text("Issuer:")
        values["credentialId"] = ask_optional_text("Credential ID (optional):")
        values["certificationDate"] = ask_date("Certification date:", default=today_string())
        values["expirationDate"] = ask_optional_date("Expiration date (optional):")
        values["verificationUrl"] = ask_url("Verification URL:")
        values["skills"] = ask_csv("Skills validated (comma separated):", required=True)
        return

    if asset_type == "resource":
        values["resourceType"] = ask_select(
            "Resource type:",
            field_enum(collection, "resourceType"),
        )
        values["format"] = ask_text("Format:")
        values["estimatedStudyTime"] = ask_text("Estimated study time:")
        values["downloadPath"] = ask_optional_download_path("Download path (optional):")
        values["externalUrl"] = ask_optional_url("External URL (optional):")
        return

    if asset_type == "learning-path":
        values["estimatedHours"] = ask_positive_number("Estimated hours:")
        values["steps"] = ask_learning_path_steps(repository)
        return

    raise ManagerError(f"Unsupported content type: {asset_type}")


def ask_title() -> str:
    return ask_text(
        "Title:",
        validate=lambda value: validate_length(value, minimum=1, maximum=70, label="Title"),
    )


def ask_description() -> str:
    return ask_text(
        "Description:",
        validate=lambda value: validate_length(value, minimum=1, maximum=160, label="Description"),
    )


def ask_text(
    message: str,
    *,
    default: str | None = None,
    instruction: str | None = None,
    validate: Any | None = None,
) -> str:
    prompt = message if instruction is None else f"{message} [{instruction}]"
    prompt_kwargs: dict[str, Any] = {"validate": validate}

    if default is not None:
        prompt_kwargs["default"] = default

    answer = questionary.text(prompt, **prompt_kwargs).ask()
    value = require_answer(answer).strip()

    if not value:
        raise ManagerError(f"{message.rstrip(':')} cannot be empty.")

    return value


def ask_optional_text(message: str) -> str | None:
    answer = questionary.text(message, default="").ask()
    value = require_answer(answer).strip()
    return value or None


def ask_confirm(message: str, *, default: bool) -> bool:
    answer = questionary.confirm(message, default=default).ask()
    return bool(require_answer(answer))


def ask_select(message: str, options: tuple[str, ...] | list[str]) -> str:
    answer = questionary.select(message, choices=list(options)).ask()
    return require_answer(answer)


def ask_csv(message: str, *, required: bool) -> list[str]:
    answer = questionary.text(message).ask()
    items = split_csv(require_answer(answer))

    if required and not items:
        raise ManagerError(f"{message.rstrip(':')} requires at least one value.")

    return items


def ask_csv_with_suggestions(
    message: str, suggestions: tuple[str, ...], *, required: bool
) -> list[str]:
    hint = f" Suggestions: {', '.join(suggestions[:8])}" if suggestions else ""
    return ask_csv(f"{message}{hint}", required=required)


def ask_technologies(repository: RepositoryInspection, *, required: bool) -> list[str]:
    technology_entries = sorted(
        repository.entries_for_collection("technologies"),
        key=lambda item: item.title.casefold(),
    )
    selected = questionary.checkbox(
        "Select technologies:",
        choices=[entry.title for entry in technology_entries],
    ).ask()
    selected_values = list(selected or [])
    extra = ask_csv("Additional technologies (comma separated, optional):", required=False)
    technologies = dedupe_preserve_order(selected_values + extra)

    if required and not technologies:
        raise ManagerError("At least one technology is required.")

    return technologies


def ask_related_assets(repository: RepositoryInspection) -> list[dict[str, str]]:
    entry_lookup = {entry_key(entry.collection, entry.slug): entry for entry in repository.entries}
    choices = [
        questionary.Choice(
            title=f"[{repository.collections[entry.collection].label}] {entry.title} ({entry.slug})",
            value=entry_key(entry.collection, entry.slug),
        )
        for entry in sorted(
            repository.entries,
            key=lambda item: (repository.collections[item.collection].label.casefold(), item.title.casefold()),
        )
    ]

    selected_keys = list(questionary.checkbox("Related assets (optional):", choices=choices).ask() or [])

    return [
        {
            "collection": entry_lookup[selected_key].collection,
            "slug": entry_lookup[selected_key].slug,
        }
        for selected_key in selected_keys
    ]


def ask_learning_path_steps(repository: RepositoryInspection) -> list[dict[str, Any]]:
    available_entries = [
        entry
        for entry in sorted(
            repository.entries,
            key=lambda item: (repository.collections[item.collection].label.casefold(), item.title.casefold()),
        )
        if entry.collection != "learning-paths"
    ]
    entry_lookup = {entry_key(entry.collection, entry.slug): entry for entry in available_entries}
    choices = [
        questionary.Choice(
            title=f"[{repository.collections[entry.collection].label}] {entry.title} ({entry.slug})",
            value=entry_key(entry.collection, entry.slug),
        )
        for entry in available_entries
    ]

    selected_keys = list(
        questionary.checkbox(
        "Learning path steps (select one or more in order):",
        choices=choices,
        ).ask()
        or []
    )

    if not selected_keys:
        raise ManagerError("A learning path requires at least one step.")

    steps: list[dict[str, Any]] = []

    for index, selected_key in enumerate(selected_keys, start=1):
        entry = entry_lookup[selected_key]
        default_title = f"Review {entry.title}"
        step_title = ask_text(
            f"Step {index} title for {entry.title}:",
            default=default_title,
        )
        steps.append(
            {
                "title": step_title,
                "order": index,
                "asset": {
                    "collection": entry.collection,
                    "slug": entry.slug,
                },
            }
        )

    return steps


def merge_learning_path_related_assets(values: dict[str, Any]) -> None:
    step_assets = [step["asset"] for step in values.get("steps", [])]
    related_assets = values.get("relatedAssets", [])
    merged = related_assets + [asset for asset in step_assets if asset not in related_assets]
    values["relatedAssets"] = merged


def ask_date(message: str, *, default: str) -> str:
    return ask_text(
        message,
        default=default,
        validate=lambda value: validate_date_text(value, label=message.rstrip(":")),
    )


def ask_optional_date(message: str) -> str | None:
    answer = questionary.text(message, default="").ask()
    value = require_answer(answer).strip()

    if not value:
        return None

    validate_date_text(value, label=message.rstrip(":"))
    return value


def ask_url(message: str) -> str:
    return ask_text(
        message,
        validate=lambda value: True if validate_url(value.strip()) else "Enter a valid URL.",
    )


def ask_optional_url(message: str) -> str | None:
    answer = questionary.text(message, default="").ask()
    value = require_answer(answer).strip()

    if not value:
        return None

    if not validate_url(value):
        raise ManagerError(f"{message.rstrip(':')} must be a valid URL.")

    return value


def ask_optional_download_path(message: str) -> str | None:
    answer = questionary.text(message, default="").ask()
    value = require_answer(answer).strip()

    if not value:
        return None

    if not value.startswith("/"):
        raise ManagerError(f"{message.rstrip(':')} must start with '/'.")

    return value


def ask_positive_number(message: str) -> int:
    answer = questionary.text(message, validate=validate_positive_number).ask()
    return int(require_answer(answer))


def field_enum(collection: CollectionSpec, field_name: str) -> tuple[str, ...]:
    field = collection.field_map()[field_name]

    if not field.enum_values:
        raise ManagerError(f"Field '{field_name}' in '{collection.name}' is not an enum.")

    return field.enum_values


def validate_length(value: str, *, minimum: int, maximum: int, label: str) -> bool | str:
    trimmed = value.strip()

    if len(trimmed) < minimum:
        return f"{label} cannot be empty."

    if len(trimmed) > maximum:
        return f"{label} must be {maximum} characters or fewer."

    return True


def validate_date_text(value: str, *, label: str) -> bool | str:
    try:
        parsed_date = date.fromisoformat(value.strip())
        if parsed_date.year < 1900:
            raise ValueError
    except ValueError:
        return f"{label} must use YYYY-MM-DD."

    return True


def validate_positive_number(value: str) -> bool | str:
    if not value.strip().isdigit():
        return "Enter a whole number."

    if int(value.strip()) <= 0:
        return "Enter a number greater than zero."

    return True


def dedupe_preserve_order(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []

    for value in values:
        key = value.casefold()
        if key in seen:
            continue
        seen.add(key)
        result.append(value)

    return result


def require_answer(answer: Any) -> Any:
    if answer is None:
        raise ManagerError("Prompt was cancelled.")

    return answer


def entry_key(collection: str, slug: str) -> str:
    return f"{collection}:{slug}"
