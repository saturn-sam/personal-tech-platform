from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Literal


FieldKind = Literal["array", "boolean", "date", "enum", "literal", "number", "object", "string", "url"]
IssueSeverity = Literal["error", "warning"]


@dataclass(frozen=True)
class FieldSpec:
    name: str
    kind: FieldKind
    required: bool = True
    default: Any | None = None
    enum_values: tuple[str, ...] = ()
    literal_value: Any | None = None
    item_spec: FieldSpec | None = None
    fields: tuple[FieldSpec, ...] = ()
    min_items: int | None = None
    max_length: int | None = None
    pattern: str | None = None
    starts_with: str | None = None
    integer: bool = False
    positive: bool = False

    def field_map(self) -> dict[str, FieldSpec]:
        return {field.name: field for field in self.fields}


@dataclass(frozen=True)
class CollectionSpec:
    name: str
    directory: str
    schema_name: str
    asset_type: str
    label: str
    route_base: str
    template_name: str
    fields: tuple[FieldSpec, ...]
    placeholder_frontmatter: dict[str, Any] = field(default_factory=dict)
    placeholder_body: str = ""
    suggestions: dict[str, tuple[str, ...]] = field(default_factory=dict)

    def field_map(self) -> dict[str, FieldSpec]:
        return {field.name: field for field in self.fields}


@dataclass(frozen=True)
class ContentEntry:
    collection: str
    path: Path
    frontmatter: dict[str, Any]
    body: str

    @property
    def slug(self) -> str:
        return str(self.frontmatter.get("slug", ""))

    @property
    def title(self) -> str:
        return str(self.frontmatter.get("title", ""))

    @property
    def status(self) -> str:
        return str(self.frontmatter.get("status", ""))


@dataclass(frozen=True)
class RepositoryInspection:
    author: str
    collections: dict[str, CollectionSpec]
    entries: tuple[ContentEntry, ...]

    def entries_for_collection(self, collection: str) -> list[ContentEntry]:
        return [entry for entry in self.entries if entry.collection == collection]

    def entry_lookup(self) -> dict[tuple[str, str], ContentEntry]:
        return {(entry.collection, entry.slug): entry for entry in self.entries}

    def title_lookup(self) -> dict[str, list[ContentEntry]]:
        titles: dict[str, list[ContentEntry]] = {}

        for entry in self.entries:
            titles.setdefault(entry.title.casefold(), []).append(entry)

        return titles

    def slug_lookup(self) -> dict[str, list[ContentEntry]]:
        slugs: dict[str, list[ContentEntry]] = {}

        for entry in self.entries:
            slugs.setdefault(entry.slug.casefold(), []).append(entry)

        return slugs


@dataclass(frozen=True)
class GeneratedContent:
    collection: CollectionSpec
    path: Path
    frontmatter: dict[str, Any]
    body: str

    @property
    def filename(self) -> str:
        return self.path.name


@dataclass(frozen=True)
class ValidationIssue:
    severity: IssueSeverity
    message: str
    path: Path | None = None


@dataclass(frozen=True)
class CommandResult:
    command: str
    exit_code: int
    stdout: str
    stderr: str

    @property
    def succeeded(self) -> bool:
        return self.exit_code == 0


@dataclass(frozen=True)
class RepositoryValidationResult:
    issues: tuple[ValidationIssue, ...]
    commands: tuple[CommandResult, ...]

    @property
    def succeeded(self) -> bool:
        return not any(issue.severity == "error" for issue in self.issues) and all(
            command.succeeded for command in self.commands
        )


@dataclass(frozen=True)
class HealthReport:
    total: int
    published: int
    review: int
    draft: int
    archived: int
    featured: int
    missing_metadata: tuple[ValidationIssue, ...]
    duplicate_slugs: tuple[ValidationIssue, ...]
    duplicate_titles: tuple[ValidationIssue, ...]
    missing_images: tuple[ValidationIssue, ...]
    broken_references: tuple[ValidationIssue, ...]


@dataclass(frozen=True)
class ContentAnswers:
    collection: CollectionSpec
    values: dict[str, Any]
