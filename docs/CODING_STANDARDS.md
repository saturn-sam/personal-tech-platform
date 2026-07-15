# Coding Standards

Version: 1.0

Status: Active

---

# Purpose

This document defines the mandatory coding standards for the Personal Technical Knowledge Platform (PTKP).

Its objectives are to:

- Maintain a consistent codebase.
- Improve readability.
- Simplify maintenance.
- Reduce defects.
- Support long-term evolution.

All source code must comply with these standards.

---

# General Principles

Follow these principles for every implementation:

- Write code for humans first.
- Prefer readability over cleverness.
- Keep functions and components focused.
- Minimize complexity.
- Remove dead code promptly.
- Refactor before duplicating logic.

---

# Project Structure

Every source file must have a clear responsibility.

Avoid mixing:

- UI
- Business logic
- Content processing
- Configuration
- Utility functions

Feature logic should remain close to the feature.

Reusable code should be placed in shared locations.

---

# Naming Conventions

## Files

Use kebab-case.

Examples:

article-card.astro

technology-grid.astro

theme-toggle.ts

---

## Components

Use PascalCase.

Examples:

ArticleCard

TechnologyGrid

SearchDialog

---

## Variables

Use camelCase.

Examples:

readingTime

relatedArticles

technologyList

---

## Constants

Use UPPER_SNAKE_CASE only for true constants.

Example:

MAX_RELATED_ARTICLES

---

## Types

Use PascalCase.

Examples:

Article

ProjectMetadata

Technology

---

## Interfaces

Prefer descriptive names.

Examples:

ArticleMetadata

SearchResult

TechnologyReference

Avoid generic names such as:

Data

Item

Object

---

# TypeScript

Strict mode is mandatory.

Avoid:

- any
- implicit any
- unnecessary type assertions

Prefer:

- readonly where applicable
- explicit return types for exported functions
- discriminated unions for complex state

---

# Astro Components

Each component should:

- Have one responsibility.
- Accept typed props.
- Avoid unnecessary client hydration.
- Remain reusable.

Business logic should remain outside presentation components.

---

# Tailwind CSS

Use utility classes consistently.

Guidelines:

- Prefer semantic composition.
- Avoid deeply nested class lists.
- Extract repeated patterns into reusable components.
- Avoid arbitrary values unless necessary.

---

# Styling

Do not use inline styles.

Do not mix multiple styling approaches.

The design system is the single source of truth.

---

# Imports

Order imports consistently:

1. Framework imports
2. Third-party packages
3. Internal libraries
4. Components
5. Types
6. Styles

Remove unused imports before committing.

---

# Functions

Functions should:

- Perform one task.
- Be easy to understand.
- Avoid excessive parameters.
- Return predictable values.

Prefer early returns over deep nesting.

---

# Components

Component responsibilities should remain small.

Large components should be decomposed into smaller reusable components.

Avoid components exceeding approximately 250 lines unless justified.

---

# Error Handling

Errors should:

- Be descriptive.
- Preserve useful context.
- Avoid exposing implementation details.

Never silently ignore failures.

---

# Logging

Console logging should not appear in production code.

Temporary debugging statements must be removed before merging.

---

# Markdown Content

Markdown should:

- Use consistent heading hierarchy.
- Include meaningful frontmatter.
- Avoid duplicate headings.
- Prefer relative internal links.

---

# MDX

Use MDX only when interactive components improve documentation.

Avoid embedding components unnecessarily.

Markdown should remain the default.

---

# Accessibility

Every interactive component must:

- Support keyboard navigation.
- Include accessible labels.
- Maintain visible focus indicators.
- Use semantic HTML.

---

# Performance

Avoid unnecessary JavaScript.

Prefer server-rendered HTML.

Lazy load heavy resources where appropriate.

Optimize images before committing.

---

# Comments

Comments should explain:

Why something exists.

Why a decision was made.

Avoid comments that merely repeat the code.

Example:

Good:

```ts
// Build the search index during compilation to avoid runtime processing.
```

Poor:

```ts
// Increment i
i++;
```

---

# Content Validation

All content must pass schema validation.

Missing required metadata should fail the build.

Broken internal links should fail validation.

---

# Git

Commit messages should follow Conventional Commits.

Examples:

feat: add technology page

fix: correct search indexing

docs: update architecture guide

refactor: simplify navigation component

chore: update dependencies

---

# Pull Requests

Each pull request should:

- Address one logical change.
- Include updated documentation where required.
- Pass all quality gates.
- Avoid unrelated modifications.

---

# Code Review Checklist

Before approving code, verify:

- Naming is consistent.
- Components are reusable.
- Types are correct.
- Accessibility is preserved.
- Performance is acceptable.
- Documentation is updated.
- No dead code exists.
- No duplicated logic exists.
- No unnecessary dependencies were added.

---

# Formatting

Use the project's formatter consistently.

Do not manually reformat unrelated files.

Formatting changes should not obscure functional changes.

---

# Dependency Management

Before adding a dependency:

- Confirm the requirement.
- Evaluate alternatives.
- Verify maintenance status.
- Assess bundle size impact.
- Document the rationale if adopted.

---

# Testing Expectations

Every feature should be validated for:

- Functional correctness.
- Accessibility.
- Responsive behavior.
- Build success.
- Type safety.

Critical utilities should include automated tests.

---

# Security

Never commit:

- Secrets
- API keys
- Tokens
- Passwords
- Private certificates

Validate all external input.

---

# Definition of Ready

Implementation should not begin until:

- Requirements are clear.
- Specifications exist.
- Dependencies are approved.
- Acceptance criteria are defined.

---

# Definition of Done

Code is complete only when:

- Requirements are satisfied.
- Standards are followed.
- Tests pass.
- Build succeeds.
- Documentation is updated.
- Accessibility is verified.
- Performance remains acceptable.
- No linting or type errors exist.

---

# Final Principle

Code is a long-term asset.

Every change should leave the codebase easier to understand, easier to maintain, and easier to extend than before.