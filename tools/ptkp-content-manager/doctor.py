from __future__ import annotations

from pathlib import Path

from rich.console import Console
from rich.table import Table

from config import ManagerPaths
from constants import VALIDATION_COMMANDS
from models import HealthReport, RepositoryInspection, RepositoryValidationResult, ValidationIssue
from utils import repo_relative, run_command
from validators import validate_repository_state

console = Console()


def repository_health(paths: ManagerPaths, repository: RepositoryInspection) -> HealthReport:
    issues = validate_repository_state(paths, repository)

    return HealthReport(
        total=len(repository.entries),
        published=count_status(repository, "published"),
        review=count_status(repository, "review"),
        draft=count_status(repository, "draft"),
        archived=count_status(repository, "archived"),
        featured=sum(1 for entry in repository.entries if entry.frontmatter.get("featured") is True),
        missing_metadata=tuple(filter_issues(issues, ("Missing required field", "cannot be empty", "cannot be null"))),
        duplicate_slugs=tuple(filter_issues(issues, ("Duplicate slug", "duplicate slug"))),
        duplicate_titles=tuple(filter_issues(issues, ("Duplicate title", "duplicate title"))),
        missing_images=tuple(filter_issues(issues, ("Missing image asset",))),
        broken_references=tuple(
            filter_issues(
                issues,
                ("points to missing content", "Internal link target was not found"),
            )
        ),
    )


def validate_repository(
    paths: ManagerPaths, repository: RepositoryInspection, *, run_external_checks: bool = True
) -> RepositoryValidationResult:
    issues = validate_repository_state(paths, repository)
    commands = ()

    if run_external_checks:
        commands = tuple(run_command(command, paths.root) for _, command in VALIDATION_COMMANDS)

    return RepositoryValidationResult(issues=issues, commands=commands)


def print_health_report(paths: ManagerPaths, report: HealthReport) -> None:
    summary = Table(title="Repository Health", show_lines=False)
    summary.add_column("Metric")
    summary.add_column("Count", justify="right")

    summary.add_row("Total content", str(report.total))
    summary.add_row("Published", str(report.published))
    summary.add_row("Review", str(report.review))
    summary.add_row("Draft", str(report.draft))
    summary.add_row("Archived", str(report.archived))
    summary.add_row("Featured", str(report.featured))
    summary.add_row("Missing metadata", str(len(report.missing_metadata)))
    summary.add_row("Duplicate slugs", str(len(report.duplicate_slugs)))
    summary.add_row("Duplicate titles", str(len(report.duplicate_titles)))
    summary.add_row("Missing images", str(len(report.missing_images)))
    summary.add_row("Broken references", str(len(report.broken_references)))

    console.print(summary)
    print_issue_group(paths, "Missing Metadata", report.missing_metadata)
    print_issue_group(paths, "Duplicate Slugs", report.duplicate_slugs)
    print_issue_group(paths, "Duplicate Titles", report.duplicate_titles)
    print_issue_group(paths, "Missing Images", report.missing_images)
    print_issue_group(paths, "Broken References", report.broken_references)


def print_validation_result(paths: ManagerPaths, result: RepositoryValidationResult) -> None:
    issue_table = Table(title="Repository Validation", show_lines=False)
    issue_table.add_column("Severity")
    issue_table.add_column("Location")
    issue_table.add_column("Message")

    if result.issues:
        for issue in result.issues:
            issue_table.add_row(
                issue.severity.upper(),
                repo_relative(issue.path, paths.root) if issue.path else "-",
                issue.message,
            )
    else:
        issue_table.add_row("INFO", "-", "No internal validation issues were found.")

    console.print(issue_table)

    for command_result in result.commands:
        status = "PASS" if command_result.succeeded else "FAIL"
        console.print(f"[bold]{status}[/bold] {command_result.command}")

        output = (command_result.stdout or command_result.stderr).strip()
        if output:
            console.print(output)


def print_issue_group(paths: ManagerPaths, title: str, issues: tuple[ValidationIssue, ...]) -> None:
    if not issues:
        return

    table = Table(title=title, show_lines=False)
    table.add_column("Location")
    table.add_column("Message")

    for issue in issues:
        table.add_row(repo_relative(issue.path, paths.root) if issue.path else "-", issue.message)

    console.print(table)


def count_status(repository: RepositoryInspection, status: str) -> int:
    return sum(1 for entry in repository.entries if entry.status == status)


def filter_issues(
    issues: tuple[ValidationIssue, ...], fragments: tuple[str, ...]
) -> list[ValidationIssue]:
    lowered = tuple(fragment.casefold() for fragment in fragments)
    return [
        issue
        for issue in issues
        if any(fragment in issue.message.casefold() for fragment in lowered)
    ]
