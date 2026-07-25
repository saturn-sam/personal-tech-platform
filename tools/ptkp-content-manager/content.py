from __future__ import annotations

from pathlib import Path

import questionary
from rich.console import Console
from rich.panel import Panel

from config import discover_paths
from constants import MENU_CHOICES, TOOL_NAME, VERSION
from doctor import print_health_report, print_validation_result, repository_health, validate_repository
from prompts import collect_metadata, select_content_type
from publisher import publish
from scanner import inspect_repository
from updater import update_modified_date
from utils import ManagerError, failure, info, success
from validators import raise_for_errors, validate_generated_content
from writer import build_generated_content, create_content

console = Console()


def banner() -> None:
    console.print()
    console.print(Panel.fit(f"{TOOL_NAME}\nVersion {VERSION}", border_style="cyan"))
    console.print()


def main() -> None:
    paths = discover_paths()
    repository = inspect_repository(paths)
    banner()

    while True:
        action = questionary.select("Choose action:", choices=list(MENU_CHOICES)).ask()
        action = action or "Exit"

        try:
            if action == "New Content":
                repository = cmd_new(paths, repository)
            elif action == "Publish Draft":
                repository = cmd_publish(paths, repository)
            elif action == "Update Modified Date":
                repository = cmd_update(paths, repository)
            elif action == "Repository Health":
                cmd_doctor(paths, repository)
            elif action == "Validate Repository":
                cmd_validate(paths, repository)
            else:
                info("Exiting PTKP Content Manager.")
                return
        except ManagerError as error:
            failure(str(error))
        except KeyboardInterrupt:
            failure("Operation cancelled.")


def cmd_new(paths, repository):
    collection = select_content_type(repository)
    answers = collect_metadata(collection, repository)
    generated = build_generated_content(paths, repository, answers)
    issues = validate_generated_content(paths, generated, repository)
    print_warnings(issues)
    raise_for_errors(issues)
    create_content(paths, repository, answers)

    try:
        refreshed = inspect_repository(paths)
        validation = validate_repository(paths, refreshed, run_external_checks=True)

        if not validation.succeeded:
            rollback_new_file(generated.path)
            print_validation_result(paths, validation)
            raise ManagerError("Validation failed after creating the new content file. The file was removed.")

        success(f"Created {generated.path.name} and verified npm run check + npm run build.")
        return refreshed
    except Exception:
        rollback_new_file(generated.path)
        raise


def cmd_publish(paths, repository):
    draft_entries = [
        entry for entry in repository.entries if entry.status in {"draft", "review"}
    ]

    if not draft_entries:
        info("No draft or review content is available.")
        return repository

    entry = select_entry("Select draft to publish:", draft_entries, repository)
    backup = entry.path.read_text(encoding="utf-8")
    publish(entry.path)

    try:
        refreshed = inspect_repository(paths)
        validation = validate_repository(paths, refreshed, run_external_checks=True)

        if not validation.succeeded:
            rollback_existing_file(entry.path, backup)
            print_validation_result(paths, validation)
            raise ManagerError("Validation failed after publishing. The file was restored.")

        success(f"Published {entry.path.name} and verified npm run check + npm run build.")
        return refreshed
    except Exception:
        rollback_existing_file(entry.path, backup)
        raise


def cmd_update(paths, repository):
    if not repository.entries:
        info("No content files are available.")
        return repository

    entry = select_entry("Select file to update modified date:", list(repository.entries), repository)
    backup = entry.path.read_text(encoding="utf-8")
    update_modified_date(entry.path)

    try:
        refreshed = inspect_repository(paths)
        validation = validate_repository(paths, refreshed, run_external_checks=True)

        if not validation.succeeded:
            rollback_existing_file(entry.path, backup)
            print_validation_result(paths, validation)
            raise ManagerError("Validation failed after updating updatedDate. The file was restored.")

        success(f"Updated {entry.path.name} and verified npm run check + npm run build.")
        return refreshed
    except Exception:
        rollback_existing_file(entry.path, backup)
        raise


def cmd_doctor(paths, repository):
    report = repository_health(paths, repository)
    print_health_report(paths, report)


def cmd_validate(paths, repository):
    validation = validate_repository(paths, repository, run_external_checks=True)
    print_validation_result(paths, validation)

    if validation.succeeded:
        success("Repository validation passed.")
    else:
        failure("Repository validation failed.")


def select_entry(message, entries, repository):
    sorted_entries = sorted(
        entries,
        key=lambda item: (
            repository.collections[item.collection].label.casefold(),
            item.title.casefold(),
        ),
    )
    entry_lookup = {f"{entry.collection}:{entry.slug}": entry for entry in sorted_entries}
    choice = questionary.select(
        message,
        choices=[
            questionary.Choice(
                title=f"[{repository.collections[entry.collection].label}] {entry.title} ({entry.slug})",
                value=f"{entry.collection}:{entry.slug}",
            )
            for entry in sorted_entries
        ],
    ).ask()

    if choice is None:
        raise ManagerError("Selection was cancelled.")

    return entry_lookup[choice]


def print_warnings(issues) -> None:
    warnings = [issue for issue in issues if issue.severity == "warning"]

    for issue in warnings:
        info(issue.message)


def rollback_new_file(path: Path) -> None:
    if path.exists():
        path.unlink()


def rollback_existing_file(path: Path, backup: str) -> None:
    path.write_text(backup, encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
