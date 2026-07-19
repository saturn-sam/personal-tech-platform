from datetime import date

from slugify import slugify


def create_slug(title: str) -> str:
    """
    Generate a URL-safe slug from a title.
    """
    return slugify(title.strip(), separator="-")


def create_filename(title: str) -> str:
    """
    Generate the markdown filename.

    Example:
    2026-07-19-vmware-vks-networking.mdx
    """
    slug = create_slug(title)
    today = date.today().isoformat()
    return f"{today}-{slug}.mdx"