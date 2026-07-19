from rich.console import Console

console = Console()


def success(message: str):
    console.print(f"[green]✔[/green] {message}")


def warning(message: str):
    console.print(f"[yellow]![/yellow] {message}")


def error(message: str):
    console.print(f"[red]✖[/red] {message}")


def info(message: str):
    console.print(f"[cyan]➜[/cyan] {message}")