# PTKP Implementation Prompt

Milestone: 2

Name: Design System Foundation

Status: Approved

---

# Purpose

Implement the reusable visual foundation for PTKP.

This milestone establishes the global design system and application shell.

No homepage or feature-specific pages should be implemented.

---

# Required Reading

Read and follow:

- AGENTS.md
- docs/DESIGN_SYSTEM.md
- docs/COMPONENT_SPEC.md
- docs/CODING_STANDARDS.md
- docs/ACCESSIBILITY.md
- docs/PERFORMANCE.md
- docs/PROJECT_SPEC.md

---

# Objective

Create the reusable visual framework that every page in PTKP will use.

The implementation should be clean, minimal, typography-driven, and aligned with the project's design philosophy.

---

# Scope

Implement:

- Global layout
- Typography system
- Color tokens
- Spacing tokens
- Border radius tokens
- Shadow tokens
- Motion tokens
- Breakpoints
- Theme infrastructure (Light, Dark, System)
- Global stylesheet
- Base HTML shell
- Header
- Footer
- Primary Navigation
- Page Container
- Section component
- Grid component
- Theme Toggle component

Do not implement the homepage or any content pages.

---

# Requirements

The implementation must:

- Follow the documented Design System.
- Use semantic HTML.
- Be fully responsive.
- Support keyboard navigation.
- Meet WCAG 2.2 AA requirements.
- Minimize JavaScript.
- Use Astro components where possible.
- Hydrate only components requiring interactivity.

---

# Deliverables

Create reusable components only.

Do not create page-specific components.

All layout elements must be reusable across the platform.

---

# Validation

Verify:

- Responsive layout
- Theme switching
- Keyboard navigation
- Accessibility
- Build success
- Lint success
- Type safety

---

# Out of Scope

Do not implement:

- Homepage
- Articles
- Projects
- Search
- Content Collections
- Cards
- Knowledge Assets

---

# Expected Output

Provide:

1. Summary
2. File tree
3. Components created
4. Design token structure
5. Accessibility considerations
6. Remaining work for Milestone 3

Do not continue beyond this milestone.