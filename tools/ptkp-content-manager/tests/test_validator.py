from __future__ import annotations

import sys
from pathlib import Path
import unittest

TOOL_ROOT = Path(__file__).resolve().parents[1]
if str(TOOL_ROOT) not in sys.path:
    sys.path.insert(0, str(TOOL_ROOT))

from config import discover_paths
from scanner import inspect_repository
from validators import validate_repository_state


class ValidatorTests(unittest.TestCase):
    def test_repository_passes_internal_validation(self) -> None:
        paths = discover_paths()
        repository = inspect_repository(paths)
        issues = validate_repository_state(paths, repository)
        self.assertEqual(issues, ())


if __name__ == "__main__":
    unittest.main()
