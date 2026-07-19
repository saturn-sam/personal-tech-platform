# PTKP Maintenance Prompt

Task: Refactor Content

Status: Approved

---

# Purpose

Refactor existing content within the Personal Technical Knowledge Platform (PTKP) to improve clarity, consistency, maintainability, and internal organization without changing the technical meaning or introducing new features.

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

Improve existing content while preserving its technical intent.

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

# Refactoring Scope

Allowed improvements include:

- Improve structure
- Improve readability
- Normalize terminology
- Improve heading hierarchy
- Consolidate duplicated information
- Improve internal linking
- Improve metadata consistency
- Improve Markdown formatting
- Improve code block formatting
- Improve diagram organization

Do not change technical meaning.

---

# Requirements

The implementation must:

- Preserve existing slugs.
- Preserve URLs.
- Preserve metadata compatibility.
- Preserve architecture.
- Preserve layouts.
- Preserve components.
- Preserve navigation.

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

- Add new content
- Remove published content
- Change routing
- Change layouts
- Change components
- Change design system
- Introduce new features

---

# Expected Output

Provide:

1. Summary of refactoring
2. Files modified
3. Structural improvements
4. Metadata improvements
5. Validation results

Only perform the requested refactoring.