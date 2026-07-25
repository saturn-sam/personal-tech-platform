from __future__ import annotations

import sys
from pathlib import Path
import unittest
from unittest.mock import patch

TOOL_ROOT = Path(__file__).resolve().parents[1]
if str(TOOL_ROOT) not in sys.path:
    sys.path.insert(0, str(TOOL_ROOT))

from config import discover_paths
from prompts import ask_learning_path_steps, ask_related_assets, ask_text, select_content_type, validate_date_text
from scanner import inspect_repository


class _FakePrompt:
    def __init__(self, answer: str) -> None:
        self._answer = answer

    def ask(self) -> str:
        return self._answer


class PromptTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.repository = inspect_repository(discover_paths())

    def test_ask_text_omits_default_when_value_is_none(self) -> None:
        captured: dict[str, object] = {}

        def fake_text(message: str, **kwargs: object) -> _FakePrompt:
            captured["message"] = message
            captured["kwargs"] = kwargs
            return _FakePrompt("Sample Title")

        with patch("prompts.questionary.text", side_effect=fake_text):
            result = ask_text("Title:")

        self.assertEqual(result, "Sample Title")
        self.assertEqual(captured["message"], "Title:")
        self.assertNotIn("default", captured["kwargs"])

    def test_ask_text_preserves_string_default(self) -> None:
        captured: dict[str, object] = {}

        def fake_text(message: str, **kwargs: object) -> _FakePrompt:
            captured["message"] = message
            captured["kwargs"] = kwargs
            return _FakePrompt("Provided Summary")

        with patch("prompts.questionary.text", side_effect=fake_text):
            result = ask_text("Summary:", default="Existing Summary")

        self.assertEqual(result, "Provided Summary")
        self.assertEqual(captured["kwargs"]["default"], "Existing Summary")

    def test_select_content_type_returns_collection_from_string_key(self) -> None:
        class _FakeSelectPrompt:
            def ask(self) -> str:
                return "lab-notes"

        with patch("prompts.questionary.select", return_value=_FakeSelectPrompt()):
            collection = select_content_type(self.repository)

        self.assertEqual(collection.name, "lab-notes")
        self.assertEqual(collection.asset_type, "lab-note")

    def test_ask_related_assets_maps_keys_to_reference_dicts(self) -> None:
        class _FakeCheckboxPrompt:
            def ask(self) -> list[str]:
                return ["articles:placeholder-article", "projects:placeholder-project"]

        with patch("prompts.questionary.checkbox", return_value=_FakeCheckboxPrompt()):
            related_assets = ask_related_assets(self.repository)

        self.assertEqual(
            related_assets,
            [
                {"collection": "articles", "slug": "placeholder-article"},
                {"collection": "projects", "slug": "placeholder-project"},
            ],
        )

    def test_ask_learning_path_steps_builds_steps_from_string_keys(self) -> None:
        class _FakeCheckboxPrompt:
            def ask(self) -> list[str]:
                return ["articles:placeholder-article"]

        with (
            patch("prompts.questionary.checkbox", return_value=_FakeCheckboxPrompt()),
            patch("prompts.ask_text", return_value="Review Placeholder Article"),
        ):
            steps = ask_learning_path_steps(self.repository)

        self.assertEqual(
            steps,
            [
                {
                    "title": "Review Placeholder Article",
                    "order": 1,
                    "asset": {
                        "collection": "articles",
                        "slug": "placeholder-article",
                    },
                }
            ],
        )

    def test_validate_date_text_rejects_invalid_calendar_dates(self) -> None:
        self.assertEqual(
            validate_date_text("2026-02-31", label="Start date"),
            "Start date must use YYYY-MM-DD.",
        )

    def test_validate_date_text_accepts_valid_date(self) -> None:
        self.assertTrue(validate_date_text("2026-07-19", label="Start date"))


if __name__ == "__main__":
    unittest.main()
