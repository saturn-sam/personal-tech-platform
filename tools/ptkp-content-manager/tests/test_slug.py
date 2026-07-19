from __future__ import annotations

import sys
from pathlib import Path
import unittest

TOOL_ROOT = Path(__file__).resolve().parents[1]
if str(TOOL_ROOT) not in sys.path:
    sys.path.insert(0, str(TOOL_ROOT))

from slug import create_filename, create_slug


class SlugTests(unittest.TestCase):
    def test_create_slug_uses_kebab_case(self) -> None:
        self.assertEqual(create_slug("PTKP Content Manager Sample"), "ptkp-content-manager-sample")

    def test_create_filename_appends_mdx(self) -> None:
        self.assertEqual(create_filename("sample-asset"), "sample-asset.mdx")


if __name__ == "__main__":
    unittest.main()
