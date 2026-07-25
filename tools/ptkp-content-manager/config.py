from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ManagerPaths:
    root: Path
    tool_root: Path
    templates_root: Path
    content_root: Path
    content_config_path: Path
    content_collections_path: Path
    content_schema_path: Path
    relationships_path: Path
    site_config_path: Path


def discover_paths() -> ManagerPaths:
    tool_root = Path(__file__).resolve().parent
    root = tool_root.parents[1]

    return ManagerPaths(
        root=root,
        tool_root=tool_root,
        templates_root=tool_root / "templates",
        content_root=root / "src" / "content",
        content_config_path=root / "src" / "content.config.ts",
        content_collections_path=root / "src" / "lib" / "content" / "collections.ts",
        content_schema_path=root / "src" / "lib" / "content" / "schema.ts",
        relationships_path=root / "src" / "lib" / "content" / "relationships.ts",
        site_config_path=root / "src" / "config" / "site.ts",
    )
