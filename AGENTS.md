# AGENTS.md

Version: 1.0

Status: Active

---

# Purpose

This document defines the operating rules for AI coding agents working on the Personal Technical Knowledge Platform (PTKP).

Every implementation task must comply with this document together with the project specifications located in the `docs/` directory.

When multiple documents exist, the following precedence applies.

1. PROJECT_SPEC.md
2. PRINCIPLES.md
3. ENGINEERING_STANDARDS.md
4. DESIGN_SYSTEM.md
5. COMPONENT_SPEC.md
6. Remaining documentation

If requirements conflict, higher-priority documents take precedence.

---

# Project Overview

PTKP is a static-first technical knowledge platform built using:

- Astro
- TypeScript
- Tailwind CSS
- MDX
- Astro Content Collections
- Cloudflare Pages

The platform prioritizes:

- Long-term maintainability
- Excellent documentation
- Minimal JavaScript
- Accessibility
- Performance
- Reusable architecture

Knowledge is the product.

---

# Primary Objective

Your responsibility is to implement PTKP exactly as documented.

Do not redesign the platform.

Do not invent features.

Do not replace documented technologies.

Follow the specifications.

---

# Required Reading

Before implementing any code, read:

- docs/PROJECT_SPEC.md
- docs/INFORMATION_ARCHITECTURE.md
- docs/CONTENT_MODEL.md
- docs/DESIGN_SYSTEM.md
- docs/ENGINEERING_STANDARDS.md
- docs/PRINCIPLES.md
- docs/VOICE_AND_WRITING.md
- docs/TECH_STACK.md
- docs/GLOSSARY.md
- docs/COMPONENT_SPEC.md
- docs/CODING_STANDARDS.md
- docs/ROADMAP.md
- docs/DEPLOYMENT.md
- docs/PERFORMANCE.md
- docs/SEO_GUIDE.md
- docs/ACCESSIBILITY.md

Implementation should not begin until these documents are understood.

---

# General Responsibilities

The AI agent shall:

- Follow documented requirements.
- Preserve architectural consistency.
- Produce readable code.
- Minimize duplication.
- Maintain accessibility.
- Maintain performance.
- Update documentation when implementation changes documented behavior.

---

# Decision Rules

When multiple implementation options exist:

1. Choose the simplest solution.
2. Prefer reusable components.
3. Prefer static rendering.
4. Minimize client-side JavaScript.
5. Follow existing patterns.

Avoid introducing unnecessary complexity.

---

# Prohibited Actions

Do not:

- Redesign layouts without instruction.
- Change the technology stack.
- Add undocumented dependencies.
- Invent undocumented features.
- Modify project structure without approval.
- Introduce breaking changes without justification.
- Disable quality checks.
- Bypass accessibility requirements.

---

# Handling Ambiguity

If documentation is ambiguous:

1. Stop implementation.
2. Explain the ambiguity.
3. Propose one or more reasonable options.
4. Wait for approval before proceeding.

Do not make assumptions about undocumented behavior.

---

# Code Quality Expectations

Generated code should be:

- Readable
- Typed
- Modular
- Accessible
- Maintainable
- Well-structured

Avoid excessive abstraction.

Avoid premature optimization.

---

# Component Development

Components should:

- Have one responsibility.
- Accept typed props.
- Follow the Design System.
- Remain reusable.
- Support accessibility.

Business logic should remain outside presentation components.

---

# Content Development

Content schemas must follow the Content Model.

Do not bypass schema validation.

Do not introduce inconsistent metadata.

---

# Styling

Follow the Design System.

Do not introduce alternative styling systems.

Avoid duplicated utility classes.

---

# Performance Expectations

Optimize for:

- Static rendering
- Small JavaScript bundles
- Efficient images
- Fast page loads
- Minimal hydration

Performance requirements are mandatory.

---

# Accessibility Expectations

Every implementation must:

- Support keyboard navigation.
- Use semantic HTML.
- Maintain visible focus indicators.
- Respect reduced motion preferences.
- Preserve sufficient color contrast.

Accessibility issues should be treated as defects.

---

# Documentation Responsibilities

Whenever implementation changes documented behavior:

- Update the affected documentation.
- Preserve consistency.
- Avoid contradictory information.

Documentation is part of the implementation.

---

# Testing Responsibilities

Before considering a task complete:

- Verify the build succeeds.
- Verify type checking succeeds.
- Verify linting succeeds.
- Verify responsive layouts.
- Verify accessibility.
- Verify navigation.
- Verify links.

Do not mark incomplete work as complete.

---

# Git Practices

Use Conventional Commits.

Keep commits focused on one logical change.

Avoid unrelated modifications.

---

# Pull Request Expectations

Every Pull Request should include:

- Summary
- Files changed
- Testing performed
- Known limitations (if any)

---

# Communication Style

When reporting progress:

- Be concise.
- Be factual.
- Explain important decisions.
- Highlight risks.
- Identify assumptions.

Avoid unnecessary commentary.

---

# Completion Criteria

A task is complete only when:

- Requirements are implemented.
- Standards are followed.
- Documentation is updated.
- Validation succeeds.
- No known defects remain within the implemented scope.

---

# Final Principle

Implement the documented architecture faithfully.

When uncertain, preserve simplicity, maintainability, and consistency rather than introducing assumptions or unnecessary complexity.