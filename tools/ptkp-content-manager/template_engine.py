from __future__ import annotations

import re
from typing import Any

from utils import ManagerError

PLACEHOLDER_PATTERN = re.compile(r"{{\s*([a-zA-Z0-9_.]+)\s*}}")


def load_template(path: str) -> str:
    with open(path, encoding="utf-8") as handle:
        return handle.read()


def render_template(template: str, context: dict[str, Any]) -> str:
    def replace(match: re.Match[str]) -> str:
        key = match.group(1)
        value = resolve_context_value(context, key)

        if value is None:
            return ""

        return str(value)

    return PLACEHOLDER_PATTERN.sub(replace, template)


def resolve_context_value(context: dict[str, Any], key: str) -> Any:
    value: Any = context

    for part in key.split("."):
        if not isinstance(value, dict) or part not in value:
            raise ManagerError(f"Template variable '{key}' is not available in the context.")

        value = value[part]

    return value
