
# PTKP Implementation Prompt

Milestone: 7

Name: Project Pages

Status: Approved

---

# Purpose

Implement the complete Project showcase system for the Personal Technical Knowledge Platform (PTKP).

Projects represent practical engineering work and should demonstrate architecture, implementation approach, operational considerations, and lessons learned. The project pages should emphasize technical depth rather than marketing.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/CONTENT_MODEL.md
- docs/INFORMATION_ARCHITECTURE.md
- docs/COMPONENT_SPEC.md
- docs/DESIGN_SYSTEM.md
- docs/CODING_STANDARDS.md
- docs/VOICE_AND_WRITING.md
- docs/ACCESSIBILITY.md
- docs/PERFORMANCE.md
- docs/SEO_GUIDE.md

---

# Objective

Implement reusable Project listing and Project detail pages using Astro Content Collections and the existing component library.

Project pages should highlight engineering decisions, technologies used, architecture, implementation challenges, and operational outcomes.

---

# Scope

Implement:

- Project index page
- Individual project pages
- Shared project layout
- Project metadata
- Technology badges
- Architecture diagram support
- Mermaid rendering
- Image galleries
- Timeline section
- Lessons learned section
- Related projects placeholder
- Previous / Next project navigation
- Breadcrumb navigation

Reuse existing layouts and UI components wherever possible.

---

# Requirements

The implementation must:

- Read projects exclusively from Astro Content Collections.
- Use shared layouts.
- Support MDX.
- Support Mermaid diagrams.
- Support responsive images.
- Display metadata consistently.
- Display technologies used.
- Display project status.
- Display implementation dates where available.
- Display related technologies.
- Display links to related Knowledge Assets.
- Meet WCAG 2.2 AA requirements.

---

# Project Page Layout

Each project page should contain:

1. Breadcrumb
2. Project Title
3. Executive Summary
4. Metadata
5. Technology Stack
6. Architecture Diagram
7. Project Overview
8. Implementation Details
9. Challenges
10. Lessons Learned
11. Related Knowledge Assets
12. Previous / Next Project
13. Footer

The layout should remain minimal, readable, and documentation-oriented.

---

# Deliverables

Implement:

- Shared Project layout
- Project listing page
- Dynamic routes
- Metadata rendering
- Mermaid support
- Responsive image support
- Project helper utilities
- Placeholder project entries
- Navigation between projects

---

# Accessibility

Ensure:

- Semantic HTML
- Proper heading hierarchy
- Accessible image alt text
- Keyboard navigation
- Accessible diagrams
- Visible focus indicators

---

# Performance

The implementation should:

- Prefer static rendering
- Optimize images
- Hydrate only interactive elements
- Minimize JavaScript
- Maintain fast page loads

---

# SEO

Implement:

- Dynamic page titles
- Meta descriptions
- Open Graph metadata
- Canonical URLs
- Project metadata
- Structured heading hierarchy

---

# Definition of Done

This milestone is considered complete only when:

- All required deliverables are implemented.
- Project pages render correctly.
- Shared layouts are reused.
- Type checking, linting, formatting, and build all succeed.
- Accessibility requirements are satisfied.
- No known defects remain within the milestone scope.

---

# Validation

Before completing the task verify:

- npm run dev succeeds
- npm run build succeeds
- npm run check succeeds
- Linting passes
- Formatting passes
- Project routes render correctly
- Mermaid diagrams render correctly
- Responsive layouts verified

---

# Out of Scope

Do not implement:

- Search
- Technology pages
- Certification pages
- Resource pages
- RSS
- Sitemap
- Analytics
- Comments
- Authentication

---

# Expected Output

Provide:

1. Summary of implementation
2. Project directory structure
3. Dynamic routes created
4. Shared layouts created
5. Helper utilities created
6. Accessibility considerations
7. Performance considerations
8. SEO implementation summary
9. Assumptions requiring approval

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