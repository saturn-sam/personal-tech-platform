from pathlib import Path

from config import CONTENT_ROOT


def scan_content():
    """
    Return every markdown content file.
    """
    return sorted(CONTENT_ROOT.rglob("*.mdx"))


def list_drafts():
    """
    Return draft markdown files.
    """
    drafts = []

    for file in scan_content():
        text = file.read_text(encoding="utf-8")

        if "draft: true" in text:
            drafts.append(file)

    return drafts