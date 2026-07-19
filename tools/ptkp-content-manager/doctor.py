from scanner import scan_content


def repository_health():
    files = scan_content()

    report = {
        "total": len(files),
        "draft": 0,
        "published": 0,
        "featured": 0,
        "missing_description": 0,
        "missing_tags": 0,
    }

    for file in files:
        text = file.read_text(encoding="utf-8")

        if "draft: true" in text:
            report["draft"] += 1
        else:
            report["published"] += 1

        if "featured: true" in text:
            report["featured"] += 1

        if 'description: ""' in text:
            report["missing_description"] += 1

        if 'tags:\n  - ""' in text:
            report["missing_tags"] += 1

    return report