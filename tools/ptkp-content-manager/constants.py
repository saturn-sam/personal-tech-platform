from pathlib import Path

TOOL_NAME = "PTKP Content Manager"
VERSION = "1.0.0"

ROOT = Path(__file__).resolve().parents[2]

CONTENT_DIR = ROOT / "src" / "content"

TEMPLATE_DIR = Path(__file__).parent / "templates"

CONTENT_TYPES = {
    "Article": "articles",
    "Lab Note": "lab-notes",
    "Architecture Guide": "architecture-guides",
    "Project": "projects",
    "Technology": "technologies",
    "Certification": "certifications",
    "Resource": "resources",
    "Learning Path": "learning-paths",
}