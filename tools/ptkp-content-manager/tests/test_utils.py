from __future__ import annotations

import sys
from pathlib import Path
import unittest
from unittest.mock import patch

TOOL_ROOT = Path(__file__).resolve().parents[1]
if str(TOOL_ROOT) not in sys.path:
    sys.path.insert(0, str(TOOL_ROOT))

from utils import run_command


class _FakeCompletedProcess:
    def __init__(self, returncode: int = 0, stdout: str = "", stderr: str = "") -> None:
        self.returncode = returncode
        self.stdout = stdout
        self.stderr = stderr


class UtilsTests(unittest.TestCase):
    def test_run_command_resolves_executable_before_execution(self) -> None:
        with (
            patch("utils.which", return_value=r"C:\Program Files\nodejs\npm.cmd") as mocked_which,
            patch("utils.run", return_value=_FakeCompletedProcess(stdout="ok")) as mocked_run,
        ):
            result = run_command(["npm", "run", "check"], Path.cwd())

        mocked_which.assert_called_once_with("npm")
        mocked_run.assert_called_once()
        self.assertEqual(mocked_run.call_args.args[0][0], r"C:\Program Files\nodejs\npm.cmd")
        self.assertEqual(mocked_run.call_args.args[0][1:], ["run", "check"])
        self.assertEqual(result.exit_code, 0)
        self.assertEqual(result.stdout, "ok")

    def test_run_command_returns_controlled_failure_when_command_is_missing(self) -> None:
        with patch("utils.which", return_value=None):
            result = run_command(["missing-command", "arg"], Path.cwd())

        self.assertEqual(result.exit_code, 127)
        self.assertIn("Command executable was not found", result.stderr)


if __name__ == "__main__":
    unittest.main()
