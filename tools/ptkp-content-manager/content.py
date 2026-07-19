import questionary
from rich.console import Console
from rich.panel import Panel

from constants import TOOL_NAME, VERSION
from prompts import collect_metadata, select_content_type
from scanner import list_drafts
from publisher import publish
from updater import update_modified_date
from utils import success, info
from writer import create_content

console = Console()


def banner():
    console.print()
    console.print(
        Panel.fit(
            f"{TOOL_NAME}\nVersion {VERSION}",
            border_style="cyan",
        )
    )
    console.print()


def cmd_new():
    content_type = select_content_type()
    metadata = collect_metadata(content_type)
    file = create_content(content_type, metadata)
    success(f"Created {file}")


def cmd_publish():
    drafts = list_drafts()

    if not drafts:
        info("No drafts found.")
        return

    choice = questionary.select(
        "Select draft to publish:",
        choices=[str(f.relative_to(f.parents[2])) for f in drafts],
    ).ask()

    file = next(f for f in drafts if str(f.relative_to(f.parents[2])) == choice)

    publish(file)

    success("Draft published.")


def cmd_update():
    drafts = list_drafts()

    if not drafts:
        info("No draft files found.")
        return

    choice = questionary.select(
        "Select file:",
        choices=[str(f.relative_to(f.parents[2])) for f in drafts],
    ).ask()

    file = next(f for f in drafts if str(f.relative_to(f.parents[2])) == choice)

    update_modified_date(file)

    success("Updated modified date.")


def main():
    banner()

    action = questionary.select(
        "Choose action:",
        choices=[
            "New Content",
            "Publish Draft",
            "Update Modified Date",
        ],
    ).ask()

    if action == "New Content":
        cmd_new()

    elif action == "Publish Draft":
        cmd_publish()

    elif action == "Update Modified Date":
        cmd_update()


if __name__ == "__main__":
    main()