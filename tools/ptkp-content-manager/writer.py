from __future__ import annotations

from pathlib import Path
from typing import Any

from config import ManagerPaths
from models import CollectionSpec, ContentAnswers, GeneratedContent, RepositoryInspection
from slug import create_filename, create_slug
from template_engine import render_template
from utils import build_mdx_document, calculate_reading_time, write_text


def create_content(
    paths: ManagerPaths, repository: RepositoryInspection, answers: ContentAnswers
) -> GeneratedContent:
    generated = build_generated_content(paths, repository, answers)
    document = build_mdx_document(generated.frontmatter, generated.body)
    write_text(generated.path, document)
    return generated


def build_generated_content(
    paths: ManagerPaths, repository: RepositoryInspection, answers: ContentAnswers
) -> GeneratedContent:
    collection = answers.collection
    values = prepare_values(collection, repository, answers.values)
    template_path = paths.templates_root / collection.template_name
    template = template_path.read_text(encoding="utf-8")
    body = render_template(template, build_template_context(collection, values))
    values["readingTime"] = calculate_reading_time(body)
    frontmatter = build_frontmatter(collection, repository, values)
    path = paths.content_root / collection.directory / create_filename(values["slug"])

    return GeneratedContent(
        collection=collection,
        path=path,
        frontmatter=frontmatter,
        body=body,
    )


def prepare_values(
    collection: CollectionSpec, repository: RepositoryInspection, answers: dict[str, Any]
) -> dict[str, Any]:
    title = str(answers["title"]).strip()
    slug = create_slug(answers.get("slug") or title)
    description = str(answers["description"]).strip()
    summary = str(answers.get("summary") or description).strip()
    status = "draft" if answers.get("draft", True) else "review"
    today = str(answers["today"])
    featured_image = build_image_object(collection, title, "featuredImage")
    prepared = {
        **answers,
        "title": title,
        "slug": slug,
        "description": description,
        "summary": summary,
        "status": status,
        "publishedDate": today,
        "updatedDate": today,
        "author": repository.author,
        "featuredImage": featured_image,
        "seo": {
            "title": title,
            "description": description,
            "canonicalPath": f"{collection.route_base}{slug}/",
            "robots": "noindex,follow",
        },
        "relatedAssets": answers.get("relatedAssets", []),
        "technologies": answers.get("technologies", []),
        "categories": answers.get("categories", []),
        "tags": answers.get("tags", []),
        "featured": bool(answers.get("featured", False)),
    }

    if collection.name == "certifications":
        prepared["badge"] = build_image_object(collection, title, "badge")

    if answers.get("includeDiagram"):
        prepared["diagram"] = {
            "language": "mermaid",
            "title": f"{title} diagram",
        }

    return prepared


def build_frontmatter(
    collection: CollectionSpec, repository: RepositoryInspection, values: dict[str, Any]
) -> dict[str, Any]:
    frontmatter: dict[str, Any] = {}
    field_resolvers = build_field_resolvers(collection, repository, values)

    for field in collection.fields:
        if field.name not in field_resolvers:
            raise KeyError(f"No resolver is available for field '{field.name}'.")

        value = field_resolvers[field.name]()

        if value is None and not should_emit_none(field):
            continue

        frontmatter[field.name] = value

    return frontmatter


def build_field_resolvers(
    collection: CollectionSpec, repository: RepositoryInspection, values: dict[str, Any]
) -> dict[str, Any]:
    field_map = collection.field_map()

    def resolver(name: str, fallback: Any = None) -> Any:
        return values.get(name, fallback)

    resolvers: dict[str, Any] = {
        "assetType": lambda: collection.asset_type,
        "title": lambda: values["title"],
        "slug": lambda: values["slug"],
        "description": lambda: values["description"],
        "summary": lambda: values["summary"],
        "author": lambda: repository.author,
        "publishedDate": lambda: values["publishedDate"],
        "updatedDate": lambda: values["updatedDate"],
        "reviewedDate": lambda: resolver("reviewedDate"),
        "revision": lambda: resolver("revision"),
        "status": lambda: values["status"],
        "tags": lambda: values["tags"],
        "technologies": lambda: values["technologies"],
        "categories": lambda: values["categories"],
        "difficulty": lambda: resolver("difficulty"),
        "relatedAssets": lambda: values["relatedAssets"],
        "featuredImage": lambda: values["featuredImage"],
        "seo": lambda: values["seo"],
        "featured": lambda: values["featured"],
        "readingTime": lambda: values["readingTime"],
        "series": lambda: resolver("series"),
        "tools": lambda: resolver("tools", []),
        "businessContext": lambda: resolver("businessContext"),
        "requirements": lambda: resolver("requirements", []),
        "assumptions": lambda: resolver("assumptions", []),
        "diagram": lambda: resolver("diagram"),
        "projectStatus": lambda: resolver("projectStatus"),
        "environment": lambda: resolver("environment"),
        "startDate": lambda: resolver("startDate"),
        "endDate": lambda: resolver("endDate"),
        "outcomes": lambda: resolver("outcomes", []),
        "gallery": lambda: resolver("gallery", []),
        "timeline": lambda: resolver("timeline", []),
        "vendor": lambda: resolver("vendor"),
        "versionInfo": lambda: resolver("versionInfo"),
        "website": lambda: resolver("website"),
        "skillLevel": lambda: resolver("skillLevel"),
        "aliases": lambda: resolver("aliases", []),
        "issuer": lambda: resolver("issuer"),
        "credentialId": lambda: resolver("credentialId"),
        "certificationDate": lambda: resolver("certificationDate"),
        "expirationDate": lambda: resolver("expirationDate"),
        "verificationUrl": lambda: resolver("verificationUrl"),
        "badge": lambda: resolver("badge"),
        "skills": lambda: resolver("skills", []),
        "resourceType": lambda: resolver("resourceType"),
        "format": lambda: resolver("format"),
        "estimatedStudyTime": lambda: resolver("estimatedStudyTime"),
        "downloadPath": lambda: resolver("downloadPath"),
        "externalUrl": lambda: resolver("externalUrl"),
        "estimatedHours": lambda: resolver("estimatedHours"),
        "steps": lambda: resolver("steps", []),
    }

    return {name: resolvers[name] for name in field_map}


def build_image_object(collection: CollectionSpec, title: str, field_name: str) -> dict[str, str]:
    placeholder = collection.placeholder_frontmatter.get(field_name)

    if not isinstance(placeholder, dict):
        placeholder = collection.placeholder_frontmatter.get("featuredImage")

    if not isinstance(placeholder, dict):
        raise ValueError(f"Collection '{collection.name}' is missing a placeholder image definition.")

    source = str(placeholder.get("src", "")).strip()

    if not source:
        raise ValueError(f"Collection '{collection.name}' does not define a placeholder image source.")

    suffix = "badge" if field_name == "badge" else "illustration"

    return {
        "src": source,
        "alt": f"{title} {suffix}",
    }


def should_emit_none(field: Any) -> bool:
    return field.required and field.default is None


def build_template_context(collection: CollectionSpec, values: dict[str, Any]) -> dict[str, Any]:
    builder = TEMPLATE_CONTEXT_BUILDERS.get(collection.asset_type)

    if builder is None:
        raise ValueError(f"No template context builder exists for asset type '{collection.asset_type}'.")

    return builder(values)


def bullet_list(items: list[str], fallback: str) -> str:
    if not items:
        return fallback

    return "\n".join(f"- {item}" for item in items)


def numbered_list(items: list[str], fallback: str) -> str:
    if not items:
        return fallback

    return "\n".join(f"{index}. {item}" for index, item in enumerate(items, start=1))


def render_diagram(diagram_id: str, title: str, technologies: list[str]) -> str:
    technology_label = " / ".join(technologies[:3]) if technologies else "Platform"
    return "\n".join(
        [
            "```mermaid",
            "flowchart LR",
            f'  Start["{title}"] --> Focus["{technology_label}"]',
            f'  Focus --> Review["Document {diagram_id.lower()} guidance"]',
            "```",
        ]
    )


def asset_reference_lines(references: list[dict[str, str]]) -> str:
    if not references:
        return "- No related Knowledge Assets selected yet."

    return "\n".join(f"- `{item['collection']}/{item['slug']}`" for item in references)


def step_lines(steps: list[dict[str, Any]]) -> str:
    if not steps:
        return "1. Add the first learning step."

    rendered = []

    for step in steps:
        asset = step["asset"]
        rendered.append(f"{step['order']}. {step['title']} (`{asset['collection']}/{asset['slug']}`)")

    return "\n".join(rendered)


def article_context(values: dict[str, Any]) -> dict[str, Any]:
    return {
        "summary": values["summary"],
        "description": values["description"],
        "technologies_bullets": bullet_list(values["technologies"], "- Add at least one technology."),
        "categories_bullets": bullet_list(values["categories"], "- Add at least one category."),
        "related_assets_bullets": asset_reference_lines(values["relatedAssets"]),
    }


def lab_note_context(values: dict[str, Any]) -> dict[str, Any]:
    return {
        "summary": values["summary"],
        "description": values["description"],
        "tools_bullets": bullet_list(values.get("tools", []), "- Add the primary command or tool."),
        "technologies_bullets": bullet_list(values["technologies"], "- Add at least one technology."),
        "related_assets_bullets": asset_reference_lines(values["relatedAssets"]),
    }


def architecture_guide_context(values: dict[str, Any]) -> dict[str, Any]:
    return {
        "summary": values["summary"],
        "business_context": values["businessContext"],
        "requirements_bullets": bullet_list(values["requirements"], "- Add at least one requirement."),
        "assumptions_bullets": bullet_list(values["assumptions"], "- Add at least one assumption."),
        "diagram_block": render_diagram("Architecture", values["title"], values["technologies"])
        if values.get("diagram")
        else "",
        "related_assets_bullets": asset_reference_lines(values["relatedAssets"]),
    }


def project_context(values: dict[str, Any]) -> dict[str, Any]:
    return {
        "summary": values["summary"],
        "environment": values["environment"],
        "project_status": values["projectStatus"],
        "outcomes_bullets": bullet_list(values["outcomes"], "- Add at least one outcome."),
        "diagram_block": render_diagram("Project", values["title"], values["technologies"])
        if values.get("diagram")
        else "",
        "related_assets_bullets": asset_reference_lines(values["relatedAssets"]),
    }


def technology_context(values: dict[str, Any]) -> dict[str, Any]:
    aliases = values.get("aliases", [])
    aliases_text = ", ".join(aliases) if aliases else "No aliases documented."
    return {
        "summary": values["summary"],
        "vendor": values.get("vendor") or "Vendor information is not documented yet.",
        "skill_level": values["skillLevel"],
        "version_info": values.get("versionInfo") or "Version-specific notes will be added during maintenance.",
        "website": values.get("website") or "Add the official website when it becomes available.",
        "aliases_text": aliases_text,
        "diagram_block": render_diagram("Technology", values["title"], values["technologies"]),
        "related_assets_bullets": asset_reference_lines(values["relatedAssets"]),
    }


def certification_context(values: dict[str, Any]) -> dict[str, Any]:
    return {
        "summary": values["summary"],
        "issuer": values["issuer"],
        "skills_bullets": bullet_list(values["skills"], "- Add at least one validated skill."),
        "technologies_bullets": bullet_list(values["technologies"], "- Add at least one technology."),
        "related_assets_bullets": asset_reference_lines(values["relatedAssets"]),
        "verification_url": values["verificationUrl"],
    }


def resource_context(values: dict[str, Any]) -> dict[str, Any]:
    location = values.get("downloadPath") or values.get("externalUrl") or "Resource location will be added during review."
    return {
        "summary": values["summary"],
        "resource_type": values["resourceType"],
        "format": values["format"],
        "estimated_study_time": values["estimatedStudyTime"],
        "resource_location": location,
        "technologies_bullets": bullet_list(values["technologies"], "- Add at least one technology."),
        "related_assets_bullets": asset_reference_lines(values["relatedAssets"]),
    }


def learning_path_context(values: dict[str, Any]) -> dict[str, Any]:
    return {
        "summary": values["summary"],
        "estimated_hours": values["estimatedHours"],
        "steps_list": step_lines(values["steps"]),
        "technologies_bullets": bullet_list(values["technologies"], "- Add at least one technology."),
        "related_assets_bullets": asset_reference_lines(values["relatedAssets"]),
    }


TEMPLATE_CONTEXT_BUILDERS = {
    "article": article_context,
    "lab-note": lab_note_context,
    "architecture-guide": architecture_guide_context,
    "project": project_context,
    "technology": technology_context,
    "certification": certification_context,
    "resource": resource_context,
    "learning-path": learning_path_context,
}
