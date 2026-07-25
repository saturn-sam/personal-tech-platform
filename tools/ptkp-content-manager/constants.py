TOOL_NAME = "PTKP Content Manager"
VERSION = "1.0.0"

DATE_FORMAT = "%Y-%m-%d"
DEFAULT_AUTHOR_FALLBACK = "Md. Samrat Uz Zaman"
PLACEHOLDER_TITLE_PREFIX = "Placeholder"
WORDS_PER_MINUTE = 225

MENU_CHOICES = (
    "New Content",
    "Publish Draft",
    "Update Modified Date",
    "Repository Health",
    "Validate Repository",
    "Exit",
)

VALIDATION_COMMANDS = (
    ("npm run check", ["npm", "run", "check"]),
    ("npm run build", ["npm", "run", "build"]),
)
