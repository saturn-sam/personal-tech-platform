from datetime import date
from pathlib import Path

from config import CONTENT_ROOT
from constants import CONTENT_TYPES
from models import ContentMetadata
from slug import create_filename, create_slug
from template_engine import load_template


def create_content(content_type: str, metadata: ContentMetadata) -> Path:
    """
    Generate a new MDX file from the appropriate template.
    """

    directory = CONTENT_ROOT / CONTENT_TYPES[content_type]
    directory.mkdir(parents=True, exist_ok=True)

    filename = create_filename(metadata.title)

    output = directory / filename

    template_name = CONTENT_TYPES[content_type].rstrip("s")

    template = load_template(template_name)

    today = date.today().isoformat()

    replacements = {
        'title: ""': f'title: "{metadata.title}"',
        'description: ""': f'description: "{metadata.description}"',
        "published: YYYY-MM-DD": f"published: {today}",
        "updated: YYYY-MM-DD": f"updated: {today}",
        "draft: true": f"draft: {str(metadata.draft).lower()}",
        "featured: false": f"featured: {str(metadata.featured).lower()}",
        "featured: true": f"featured: {str(metadata.featured).lower()}",
        "difficulty: Beginner": f"difficulty: {metadata.difficulty}",
        "difficulty: Intermediate": f"difficulty: {metadata.difficulty}",
        "difficulty: Advanced": f"difficulty: {metadata.difficulty}",
    }

    for old, new in replacements.items():
        template = template.replace(old, new)

    if metadata.tags:
        tag_block = "\n".join(f'  - "{tag}"' for tag in metadata.tags)
        template = template.replace(
            'tags:\n  - ""',
            f"tags:\n{tag_block}",
        )

    slug = create_slug(metadata.title)

    template = (
        template
        .replace("slug: \"\"", f'slug: "{slug}"')
        .replace("projectId: \"\"", f'projectId: "{slug}"')
    )

    output.write_text(template, encoding="utf-8")

    return output