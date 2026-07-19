from slugify import slugify


def create_slug(value: str) -> str:
    return slugify(value, lowercase=True, separator="-")


def create_filename(slug: str) -> str:
    return f"{slug}.mdx"
