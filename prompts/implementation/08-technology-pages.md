
# PTKP Implementation Prompt

Milestone: 8

Name: Technology Pages

Status: Approved

---

# Purpose

Implement the complete Technology knowledge system for the Personal Technical Knowledge Platform (PTKP).

Technology Pages provide structured reference documentation for technologies, platforms, tools, programming languages, frameworks, and products. They should serve as long-term technical references and connect related Knowledge Assets, Projects, and Certifications.

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

These documents are authoritative.

---

# Objective

Implement reusable Technology listing and Technology detail pages using Astro Content Collections and the existing component library.

Technology pages should provide structured documentation while maintaining consistency with the rest of PTKP.

---

# Scope

Implement:

- Technology index page
- Individual technology pages
- Shared technology layout
- Technology metadata
- Category grouping
- Technology overview
- Key concepts
- Architecture overview
- Installation section
- Configuration section
- Best practices
- Common issues
- References
- Related Knowledge Assets
- Related Projects
- Related Certifications
- Breadcrumb navigation
- Previous / Next navigation

Reuse existing layouts and UI components wherever possible.

---

# Requirements

The implementation must:

- Read technologies exclusively from Astro Content Collections.
- Use shared layouts.
- Support MDX.
- Support Mermaid diagrams.
- Support syntax highlighting.
- Support responsive tables.
- Display metadata consistently.
- Display technology categories.
- Display version information where available.
- Display related content.
- Meet WCAG 2.2 AA requirements.

---

# Technology Page Layout

Each Technology page should contain:

1. Breadcrumb
2. Technology Name
3. Short Description
4. Metadata
5. Category
6. Overview
7. Key Concepts
8. Installation
9. Configuration
10. Best Practices
11. Common Issues
12. References
13. Related Knowledge Assets
14. Related Projects
15. Related Certifications
16. Previous / Next Navigation
17. Footer

The layout should remain clean, documentation-oriented, and content-focused.

---

# Deliverables

Implement:

- Shared Technology layout
- Technology listing page
- Dynamic routes
- Metadata rendering
- Mermaid support
- Syntax-highlighted code blocks
- Technology helper utilities
- Placeholder technology entries
- Navigation between technologies

---

# Accessibility

Ensure:

- Semantic HTML
- Proper heading hierarchy
- Accessible tables
- Accessible code blocks
- Keyboard navigation
- Visible focus indicators

---

# Performance

The implementation should:

- Prefer static rendering
- Hydrate only interactive elements
- Minimize JavaScript
- Optimize page rendering
- Maintain fast page loads

---

# SEO

Implement:

- Dynamic page titles
- Meta descriptions
- Open Graph metadata
- Canonical URLs
- Technology metadata
- Structured heading hierarchy

---

# Definition of Done

This milestone is considered complete only when:

- All required deliverables are implemented.
- Technology pages render correctly.
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
- Technology routes render correctly
- Mermaid diagrams render correctly
- Code blocks render correctly
- Responsive layouts verified

---

# Out of Scope

Do not implement:

- Search
- Certification pages
- Resource pages
- RSS
- Sitemap
- Analytics
- Comments
- Authentication

If uncertain whether a feature belongs to this milestone, exclude it.

---

# Expected Output

Provide:

1. Summary of implementation
2. Technology directory structure
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