# PTKP Maintenance Prompt

Task: Review Content

Status: Approved

---

# Purpose

Perform a comprehensive review of existing content within the Personal Technical Knowledge Platform (PTKP) to ensure technical accuracy, consistency, completeness, and alignment with the established content standards.

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

Review one or more existing content items and identify improvements without changing the platform architecture.

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

# Review Criteria

Review the content for:

- Technical accuracy
- Completeness
- Metadata quality
- Grammar
- Terminology consistency
- Markdown formatting
- Internal links
- External references
- Related content
- Diagram quality
- Code example quality
- Accessibility

---

# Requirements

The review must:

- Preserve existing slugs.
- Preserve architecture.
- Preserve routing.
- Preserve layouts.
- Preserve components.
- Identify improvements without implementing unrelated changes.

---

# Deliverables

For each reviewed item provide:

- Overall assessment
- Strengths
- Issues found
- Recommended improvements
- Priority of each issue
- Validation summary

---

# Validation

Verify:

- Metadata remains valid.
- Internal links resolve correctly.
- Build succeeds.
- No formatting issues.
- No broken Markdown.

---

# Out of Scope

Do not:

- Redesign pages
- Change routing
- Change layouts
- Change components
- Change design system
- Introduce new features

---

# Expected Output

Provide:

1. Content reviewed
2. Review findings
3. Recommended improvements
4. Validation results
5. Overall quality assessment

Only perform the requested review.