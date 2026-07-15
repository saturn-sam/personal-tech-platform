# PTKP Implementation Prompt

Milestone: 4

Name: Component Library

Status: Approved

---

# Purpose

Implement the reusable UI component library for the Personal Technical Knowledge Platform (PTKP).

This milestone establishes the foundational UI components that will be reused throughout the platform. Components must remain presentation-focused and independent of business logic.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/COMPONENT_SPEC.md
- docs/DESIGN_SYSTEM.md
- docs/CODING_STANDARDS.md
- docs/ACCESSIBILITY.md
- docs/PERFORMANCE.md

---

# Objective

Create a reusable, accessible, and lightweight component library aligned with the PTKP design system.

The component library should be the only source of UI primitives used by future pages.

---

# Scope

Implement reusable components including, where defined by the specifications:

- Button
- Link
- Card
- Badge
- Tag
- Chip
- Avatar
- Icon wrapper
- Container
- Stack
- Grid
- Section
- Divider
- Breadcrumb
- Pagination
- Callout
- CodeBlock wrapper
- Mermaid wrapper
- Table wrapper
- Copy-to-clipboard button
- Theme toggle
- Loading/Skeleton components (if specified)

Implement only reusable components.

---

# Requirements

The implementation must:

- Follow the Design System exactly.
- Use TypeScript.
- Use Astro components whenever possible.
- Hydrate only when interactivity is required.
- Support responsive layouts.
- Follow WCAG 2.2 AA accessibility requirements.
- Support keyboard navigation where applicable.
- Avoid duplicated styling.
- Keep components composable and reusable.

---

# Deliverables

Create:

- UI component directory structure
- Reusable components
- Shared component utilities (if required)
- Component exports
- Basic component documentation or examples if defined in the specifications

No page-specific components should be created.

---

# Validation

Before completing the task, verify:

- `npm run dev` succeeds.
- `npm run build` succeeds.
- `npm run check` succeeds.
- Type checking passes.
- Linting passes.
- Formatting passes.
- Components render without runtime errors.

---

# Out of Scope

Do not implement:

- Homepage
- Article pages
- Project pages
- Technology pages
- Search
- Content rendering
- Business logic
- API integrations

If uncertain whether a component belongs to this milestone, exclude it.

---

# Expected Output

Provide:

1. Summary of completed work.
2. Component directory tree.
3. List of implemented components.
4. Accessibility considerations.
5. Any assumptions requiring approval.
6. Recommended next milestone.

Do not implement anything beyond this milestone.

---

# Definition of Done

This milestone is considered complete only when:

- All required deliverables are implemented.
- The implementation complies with the project specifications.
- No placeholder UI components are introduced outside the defined scope.
- Type checking, linting, formatting, and build all succeed.
- Accessibility requirements are satisfied.
- No known defects remain within the milestone scope.