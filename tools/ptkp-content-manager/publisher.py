from __future__ import annotations

from pathlib import Path

from utils import build_mdx_document, load_frontmatter_file, today_string, write_text


def publish(path: Path) -> None:
    frontmatter, body = load_frontmatter_file(path)
    today = today_string()

    frontmatter["status"] = "published"
    frontmatter["publishedDate"] = today
    frontmatter["updatedDate"] = today

    seo = frontmatter.get("seo")
    if isinstance(seo, dict):
        seo["robots"] = "index,follow"

    write_text(path, build_mdx_document(frontmatter, body))
