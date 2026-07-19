# PTKP Maintenance Prompt

Task: Update Existing Content

Status: Approved

---

# Purpose

Update existing content within the Personal Technical Knowledge Platform (PTKP) while preserving the established architecture, content model, metadata standards, and internal relationships.

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

Modify one or more existing content items while maintaining consistency across the platform.

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

- Preserve existing slugs unless explicitly instructed.
- Preserve metadata consistency.
- Maintain internal relationships.
- Update "Last Updated" metadata where applicable.
- Keep all internal links valid.
- Preserve Markdown quality.
- Preserve existing layouts and components.

Do not modify layouts or components unless explicitly instructed.

---

# Update Types

Supported updates include:

- Technical corrections
- Version updates
- Additional implementation details
- New references
- Metadata updates
- Relationship updates
- Grammar improvements
- Diagram improvements

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

1. Summary of updated content
2. Files modified
3. Metadata changes
4. Relationship changes
5. Validation results

Do not perform work outside the requested content updates.