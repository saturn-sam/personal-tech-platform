from dataclasses import dataclass, field


@dataclass
class ContentMetadata:
    title: str
    description: str
    difficulty: str
    tags: list[str] = field(default_factory=list)
    featured: bool = False
    draft: bool = True