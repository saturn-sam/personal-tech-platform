from pathlib import Path

from config import CONTENT_ROOT
from slug import create_filename


def validate_title(title: str) -> None:
    if len(title.strip()) < 5:
        raise ValueError("Title must contain at least 5 characters.")


def validate_description(description: str) -> None:
    if len(description.strip()) < 20:
        raise ValueError("Description must contain at least 20 characters.")


def validate_tags(tags: list[str]) -> None:
    if not tags:
        raise ValueError("At least one tag is required.")


def validate_duplicate(content_type: str, title: str) -> None:
    filename = create_filename(title)

    directory = CONTENT_ROOT / content_type

    if (directory / filename).exists():
        raise FileExistsError(f"{filename} already exists.")