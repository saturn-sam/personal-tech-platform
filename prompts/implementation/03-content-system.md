# PTKP Implementation Prompt

Milestone: 3

Name: Content System

Status: Approved

---

# Purpose

Implement the complete content management foundation for the Personal Technical Knowledge Platform (PTKP).

This milestone establishes how content is organized, validated, authored, and consumed throughout the platform using Astro Content Collections and MDX.

No public pages should be implemented.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/CONTENT_MODEL.md
- docs/INFORMATION_ARCHITECTURE.md
- docs/ENGINEERING_STANDARDS.md
- docs/CODING_STANDARDS.md
- docs/PRINCIPLES.md
- docs/TECH_STACK.md

---

# Objective

Implement a scalable, strongly typed content system that serves as the canonical source of all PTKP knowledge assets.

The implementation must support future growth while maintaining strict validation and consistency.

---

# Scope

Implement:

- Astro Content Collections
- Collection registration
- Zod schemas for all content types
- Shared schema utilities where appropriate
- MDX configuration
- Syntax highlighting configuration
- Mermaid support for MDX
- Remark/Rehype plugins required by the specifications
- Collection utilities
- Content helper functions
- Placeholder content for every collection
- Type-safe content access

Do not implement page rendering or UI components.

---

# Required Content Collections

Implement collections for:

- articles
- lab-notes
- architecture-guides
- projects
- technologies
- certifications
- resources
- learning-paths

Each collection must contain at least one placeholder entry that validates successfully.

---

# Requirements

The implementation must:

- Follow the Content Model exactly.
- Use strict schema validation.
- Use TypeScript throughout.
- Keep helper functions reusable.
- Keep content independent from presentation.
- Organize collections clearly and consistently.
- Produce no validation warnings or errors.

---

# Deliverables

Create and configure:

- Content collection definitions
- Zod schemas
- Shared schema utilities (if appropriate)
- MDX configuration
- Content helper utilities
- Placeholder content entries
- Collection documentation where necessary

---

# Validation

Before completing the task, verify:

- All collections register successfully.
- Placeholder content validates successfully.
- `npm run dev` succeeds.
- `npm run build` succeeds.
- `npm run check` succeeds.
- Linting passes.
- Formatting passes.
- Type checking passes.

No warnings or errors should remain unresolved.

---

# Out of Scope

Do not implement:

- Homepage
- Layouts
- Navigation
- Components
- Search
- Project pages
- Article pages
- Technology pages
- RSS generation
- Sitemap generation
- SEO metadata rendering

If uncertain whether a feature belongs to this milestone, exclude it.

---

# Expected Output

Provide:

1. Summary of completed work.
2. Content collection directory tree.
3. List of implemented collections.
4. List of schemas created.
5. List of helper utilities created.
6. Any assumptions requiring approval.
7. Recommended next milestone.

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