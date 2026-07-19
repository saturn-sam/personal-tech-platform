from pathlib import Path

from config import TEMPLATES


def load_template(name: str) -> str:
    path: Path = TEMPLATES / f"{name}.md"

    if not path.exists():
        raise FileNotFoundError(path)

    return path.read_text(encoding="utf-8")