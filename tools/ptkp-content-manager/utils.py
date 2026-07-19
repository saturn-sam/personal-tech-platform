from __future__ import annotations

from datetime import date, datetime
from pathlib import Path
from subprocess import CompletedProcess, run
from shutil import which
from typing import Any, Iterable
from urllib.parse import urlparse

import yaml
from rich.console import Console

from constants import DATE_FORMAT, WORDS_PER_MINUTE
from models import CommandResult

console = Console()


class ManagerError(RuntimeError):
    """Raised when the content manager cannot continue safely."""


def today_string() -> str:
    return date.today().strftime(DATE_FORMAT)


def calculate_reading_time(markdown: str, words_per_minute: int = WORDS_PER_MINUTE) -> dict[str, Any]:
    words = [word for word in markdown.strip().split() if word]
    minutes = max(1, (len(words) + words_per_minute - 1) // words_per_minute)

    return {
        "minutes": minutes,
        "text": f"{minutes} min read",
    }


def split_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def parse_frontmatter_document(text: str) -> tuple[dict[str, Any], str]:
    if not text.startswith("---"):
        raise ManagerError("MDX file is missing frontmatter.")

    marker = "\n---"
    end_index = text.find(marker, 3)

    if end_index < 0:
        raise ManagerError("Frontmatter block is not closed.")

    frontmatter_text = text[3:end_index].strip()
    body = text[end_index + len(marker) :].lstrip("\r\n")
    data = yaml.safe_load(frontmatter_text) or {}

    if not isinstance(data, dict):
        raise ManagerError("Frontmatter must deserialize to a mapping.")

    return data, body


def load_frontmatter_file(path: Path) -> tuple[dict[str, Any], str]:
    return parse_frontmatter_document(path.read_text(encoding="utf-8"))


def dump_frontmatter(data: dict[str, Any]) -> str:
    return yaml.safe_dump(data, sort_keys=False, allow_unicode=False, default_flow_style=False).strip()


def build_mdx_document(frontmatter: dict[str, Any], body: str) -> str:
    rendered_frontmatter = dump_frontmatter(frontmatter)
    normalized_body = body.strip()

    return f"---\n{rendered_frontmatter}\n---\n\n{normalized_body}\n"


def parse_date_value(value: Any) -> date | None:
    if value is None or value == "":
        return None

    if isinstance(value, datetime):
        return value.date()

    if isinstance(value, date):
        return value

    if isinstance(value, str):
        return date.fromisoformat(value)

    raise ValueError(f"Unsupported date value: {value!r}")


def validate_url(value: str) -> bool:
    parsed = urlparse(value)
    return bool(parsed.scheme and parsed.netloc)


def repo_relative(path: Path, root: Path) -> str:
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)


def success(message: str) -> None:
    console.print(f"[bold green]Success:[/bold green] {message}")


def info(message: str) -> None:
    console.print(f"[bold cyan]Info:[/bold cyan] {message}")


def warning(message: str) -> None:
    console.print(f"[bold yellow]Warning:[/bold yellow] {message}")


def failure(message: str) -> None:
    console.print(f"[bold red]Error:[/bold red] {message}")


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")


def as_tuple(values: Iterable[str]) -> tuple[str, ...]:
    return tuple(dict.fromkeys(values))


def run_command(command: list[str], cwd: Path) -> CommandResult:
    resolved_command = resolve_command(command)

    if resolved_command is None:
        return CommandResult(
            command=" ".join(command),
            exit_code=127,
            stdout="",
            stderr=f"Command executable was not found: {command[0]}",
        )

    try:
        completed: CompletedProcess[str] = run(
            resolved_command,
            cwd=cwd,
            check=False,
            text=True,
            capture_output=True,
        )
    except OSError as error:
        return CommandResult(
            command=" ".join(command),
            exit_code=127,
            stdout="",
            stderr=str(error),
        )

    return CommandResult(
        command=" ".join(command),
        exit_code=completed.returncode,
        stdout=completed.stdout,
        stderr=completed.stderr,
    )


def resolve_command(command: list[str]) -> list[str] | None:
    if not command:
        return None

    executable = which(command[0])

    if executable is None:
        return None

    return [executable, *command[1:]]
