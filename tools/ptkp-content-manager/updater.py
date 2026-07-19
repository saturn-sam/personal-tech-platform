from datetime import date
from pathlib import Path


def update_modified_date(file: Path):
    today = date.today().isoformat()

    text = file.read_text(encoding="utf-8")

    lines = []

    for line in text.splitlines():
        if line.startswith("updated:"):
            lines.append(f"updated: {today}")
        else:
            lines.append(line)

    file.write_text(
        "\n".join(lines),
        encoding="utf-8",
    )