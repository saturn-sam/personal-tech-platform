import questionary

from models import ContentMetadata
from constants import CONTENT_TYPES

from validators import (
    validate_description,
    validate_duplicate,
    validate_tags,
    validate_title,
)


def select_content_type() -> str:
    return questionary.select(
        "Select content type:",
        choices=list(CONTENT_TYPES.keys()),
    ).ask()


def collect_metadata(content_type: str) -> ContentMetadata:
    title = questionary.text(
        "Title:",
        validate=lambda text: len(text.strip()) > 3,
    ).ask()

    description = questionary.text(
        "Description:",
        validate=lambda text: len(text.strip()) > 10,
    ).ask()

    difficulty = questionary.select(
        "Difficulty:",
        choices=[
            "Beginner",
            "Intermediate",
            "Advanced",
        ],
    ).ask()

    tags = questionary.text(
        "Tags (comma separated):",
    ).ask()

    featured = questionary.confirm(
        "Featured?",
        default=False,
    ).ask()

    draft = questionary.confirm(
        "Create as draft?",
        default=True,
    ).ask()

    validate_title(title)
    validate_description(description)

    tag_list = [t.strip() for t in tags.split(",") if t.strip()]

    validate_tags(tag_list)

    validate_duplicate(
        CONTENT_TYPES[content_type],
        title,
    )


    return ContentMetadata(
        title=title,
        description=description,
        difficulty=difficulty,
        tags=tag_list,
        featured=featured,
        draft=draft,
    )