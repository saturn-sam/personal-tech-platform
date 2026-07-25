from __future__ import annotations

import sys
from pathlib import Path
import unittest

TOOL_ROOT = Path(__file__).resolve().parents[1]
if str(TOOL_ROOT) not in sys.path:
    sys.path.insert(0, str(TOOL_ROOT))

from config import discover_paths
from models import ContentAnswers
from scanner import inspect_repository
from writer import build_generated_content


class WriterTests(unittest.TestCase):
    def test_article_generation_matches_discovered_schema(self) -> None:
        paths = discover_paths()
        repository = inspect_repository(paths)
        collection = repository.collections["articles"]
        generated = build_generated_content(
            paths,
            repository,
            ContentAnswers(
                collection=collection,
                values={
                    "today": "2026-07-19",
                    "title": "Writer Test Article",
                    "description": "Validation article for the PTKP content manager writer.",
                    "summary": "Validation article for the PTKP content manager writer.",
                    "difficulty": "intermediate",
                    "tags": ["Validation"],
                    "technologies": ["Kubernetes"],
                    "categories": ["Containers"],
                    "featured": False,
                    "draft": True,
                    "relatedAssets": [],
                    "series": None,
                },
            ),
        )

        self.assertEqual(generated.frontmatter["assetType"], "article")
        self.assertEqual(generated.frontmatter["slug"], "writer-test-article")
        self.assertIn("## Context", generated.body)

    def test_case_study_generation_matches_discovered_schema(self) -> None:
        paths = discover_paths()
        repository = inspect_repository(paths)
        collection = repository.collections["case-studies"]
        generated = build_generated_content(
            paths,
            repository,
            ContentAnswers(
                collection=collection,
                values={
                    "today": "2026-07-19",
                    "title": "Writer Test Case Study",
                    "description": "Validation case study for the PTKP content manager writer.",
                    "summary": "Validation case study for the PTKP content manager writer.",
                    "difficulty": "advanced",
                    "tags": ["Validation"],
                    "technologies": ["Kubernetes"],
                    "categories": ["Containers"],
                    "featured": False,
                    "draft": True,
                    "relatedAssets": [],
                    "context": "Shared release workflows needed a documented decision trail.",
                    "requirements": ["Keep release review repeatable."],
                    "constraints": ["Approval steps could not be removed."],
                    "alternativesConsidered": ["Manual release review in chat."],
                    "decision": "Standardize the workflow in version-controlled documentation.",
                    "implementationSummary": "Captured the decision as a reusable operating pattern.",
                    "outcome": "Release reviews became easier to audit.",
                    "lessonsLearned": ["Decision records are useful only when they stay current."],
                    "futureImprovements": ["Link future revisions to deployment evidence."],
                },
            ),
        )

        self.assertEqual(generated.frontmatter["assetType"], "case-study")
        self.assertEqual(generated.frontmatter["slug"], "writer-test-case-study")
        self.assertIn("## Alternatives Considered", generated.body)


if __name__ == "__main__":
    unittest.main()
