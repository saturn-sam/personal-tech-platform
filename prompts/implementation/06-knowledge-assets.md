
# PTKP Implementation Prompt

Milestone: 6

Name: Knowledge Assets

Status: Approved

---

# Purpose

Implement the complete Knowledge Asset system for the Personal Technical Knowledge Platform (PTKP).

Knowledge Assets are the primary content entities of the platform and represent the core value of PTKP. This milestone establishes how technical knowledge is rendered, organized, and presented using the content system and reusable components implemented in previous milestones.

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

Implement the complete rendering system for all Knowledge Assets using Astro Content Collections and reusable UI components.

The implementation must produce a consistent reading experience across all content types.

---

# Scope

Implement rendering support for:

- Articles
- Lab Notes
- Architecture Guides

Create:

- Collection index pages
- Individual content pages
- Shared content layout
- Content metadata presentation
- Table of Contents
- Previous/Next navigation
- Reading time
- Last updated information
- Tags
- Breadcrumb navigation
- Code block rendering
- Mermaid diagram rendering
- Callout rendering
- Data table rendering
- Copy-to-clipboard integration
- Edit metadata display
- Related content placeholders (layout only)

All rendering must use the existing component library.

---

# Requirements

The implementation must:

- Read content exclusively from Astro Content Collections.
- Use shared layouts for all Knowledge Assets.
- Support MDX.
- Support syntax highlighting.
- Support Mermaid diagrams.
- Support responsive tables.
- Display metadata consistently.
- Display publication and update dates.
- Display reading time.
- Display tags.
- Display breadcrumb navigation.
- Use semantic HTML.
- Be fully responsive.
- Meet WCAG 2.2 AA requirements.

---

# Content Layout

Each Knowledge Asset page should contain:

1. Breadcrumb
2. Title
3. Description
4. Metadata
5. Tags
6. Table of Contents
7. Main Content
8. Previous / Next Navigation
9. Related Content Placeholder
10. Footer

The layout must remain clean, typography-driven, and distraction-free.

---

# Deliverables

Implement:

- Shared Knowledge Asset layout
- Collection listing pages
- Dynamic routes
- MDX rendering
- Metadata rendering
- TOC generation
- Reading time calculation
- Breadcrumb generation
- Navigation between adjacent content
- Reusable helpers for content rendering

No search functionality should be implemented.

---

# Accessibility

Ensure:

- Proper heading hierarchy
- Semantic landmarks
- Accessible code blocks
- Accessible tables
- Keyboard-accessible navigation
- Visible focus indicators
- Correct ARIA usage where required

---

# Performance

The implementation should:

- Prefer static rendering
- Hydrate only interactive elements
- Optimize MDX rendering
- Minimize JavaScript
- Avoid unnecessary client-side processing

---

# SEO

Implement:

- Dynamic page titles
- Meta descriptions
- Open Graph metadata
- Canonical URLs
- Article metadata
- Structured heading hierarchy

Do not implement RSS or sitemap generation in this milestone.

---

# Definition of Done

This milestone is considered complete only when:

- All required deliverables are implemented.
- Rendering works for all supported Knowledge Asset types.
- Shared layouts are used consistently.
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
- Dynamic routes render correctly
- MDX content renders correctly
- Mermaid diagrams render correctly
- Code blocks render correctly
- TOC functions correctly
- Reading time is displayed
- Responsive layouts verified

---

# Out of Scope

Do not implement:

- Search
- Project pages
- Technology pages
- Certification pages
- Resource pages
- RSS
- Sitemap
- Comments
- Authentication
- Analytics

If uncertain whether a feature belongs to this milestone, exclude it.

---

# Expected Output

Provide:

1. Summary of implementation
2. Knowledge Asset directory structure
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