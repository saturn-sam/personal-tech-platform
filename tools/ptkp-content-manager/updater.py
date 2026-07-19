from __future__ import annotations

from pathlib import Path

from utils import build_mdx_document, load_frontmatter_file, today_string, write_text


def update_modified_date(path: Path) -> None:
    frontmatter, body = load_frontmatter_file(path)
    frontmatter["updatedDate"] = today_string()
    write_text(path, build_mdx_document(frontmatter, body))
