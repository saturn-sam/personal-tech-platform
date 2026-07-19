from datetime import date
from pathlib import Path


def publish(file: Path):
    """
    Publish a draft.
    """

    today = date.today().isoformat()

    text = file.read_text(encoding="utf-8")

    text = text.replace(
        "draft: true",
        "draft: false",
        1,
    )

    if "published: YYYY-MM-DD" in text:
        text = text.replace(
            "published: YYYY-MM-DD",
            f"published: {today}",
        )

    if "updated: YYYY-MM-DD" in text:
        text = text.replace(
            "updated: YYYY-MM-DD",
            f"updated: {today}",
        )

    file.write_text(text, encoding="utf-8")