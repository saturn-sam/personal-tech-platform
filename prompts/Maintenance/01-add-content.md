# PTKP Maintenance Prompt

Task: Add New Content

Status: Approved

---

# Purpose

Add new content to the Personal Technical Knowledge Platform (PTKP) while preserving the established architecture, content model, metadata standards, and design consistency.

No architectural, structural, or component changes are permitted.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/CONTENT_GUIDE.md
- docs/AUTHORING_GUIDE.md
- docs/CONTENT_STYLE_GUIDE.md
- docs/CONTENT_MODEL.md

These documents are authoritative.

---

# Objective

Add one or more new content items using the existing Content Collections.

Supported content types:

- Article
- Lab Note
- Architecture Guide
- Project
- Technology
- Certification
- Resource
- Learning Path

---

# Requirements

The implementation must:

- Reuse existing layouts.
- Reuse existing components.
- Follow existing metadata schema.
- Follow existing naming conventions.
- Maintain internal relationships.
- Maintain Markdown quality.
- Preserve the existing architecture.

Do not modify layouts or components unless explicitly instructed.

---

# Content Requirements

Every new content item must include:

- Complete metadata
- Proper slug
- Description
- Tags
- Related Technologies
- Related Projects (when applicable)
- Related Knowledge Assets (when applicable)

Include internal links wherever appropriate.

---

# Validation

Before completing the task verify:

- Metadata validates successfully.
- Internal links resolve correctly.
- Build succeeds.
- No linting errors.
- No formatting issues.

---

# Out of Scope

Do not:

- Change layouts
- Change routing
- Change components
- Change design system
- Change navigation
- Change search

---

# Expected Output

Provide:

1. Summary of added content
2. Files created
3. Metadata summary
4. Relationships added
5. Validation results

Do not perform any work outside the requested content additions.