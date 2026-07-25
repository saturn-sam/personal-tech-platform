# PTKP Maintenance Prompt

Task: Archive Content

Status: Approved

---

# Purpose

Archive existing content within the Personal Technical Knowledge Platform (PTKP) while preserving historical integrity, internal references, and platform consistency.

Archiving removes content from active discovery without deleting it.

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

Archive one or more content items without affecting existing architecture or published history.

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

# Archiving Rules

Archived content must:

- Remain in version control.
- Preserve URLs where practical.
- Be excluded from normal navigation.
- Be excluded from homepage features.
- Be excluded from search results unless archival search is explicitly enabled.
- Clearly indicate archived status.
- Display the archive date.
- Display the archive reason.

---

# Metadata

Add or update:

- archived: true
- archiveDate
- archiveReason

Do not remove historical metadata.

---

# Requirements

The implementation must:

- Preserve slugs.
- Preserve relationships.
- Preserve Markdown.
- Preserve Git history.
- Preserve architecture.
- Preserve layouts.
- Preserve components.

---

# Validation

Before completing the task verify:

- Archived content renders correctly.
- Navigation excludes archived content.
- Search behavior follows project rules.
- Build succeeds.
- Metadata validates successfully.

---

# Out of Scope

Do not:

- Delete content
- Change layouts
- Change routing
- Change components
- Change design system
- Introduce new features

---

# Expected Output

Provide:

1. Archived content
2. Archive reason
3. Metadata updates
4. Navigation impact
5. Validation results

Only perform the requested archival operation.