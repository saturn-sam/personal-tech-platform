# PTKP Implementation Prompt

Milestone: 14

Name: Documentation Experience

Status: Approved

---

# Purpose

Transform PTKP into a professional engineering documentation platform by improving the documentation reading experience while preserving the existing architecture and visual identity.

This milestone focuses entirely on documentation usability.

Do not redesign the platform.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/COMPONENT_SPEC.md
- docs/DESIGN_SYSTEM.md
- docs/PERFORMANCE.md
- docs/ACCESSIBILITY.md
- docs/CODING_STANDARDS.md

These documents are authoritative.

---

# Objective

Improve every documentation page so it feels comparable to modern engineering documentation sites.

The implementation must remain:

- Static-first
- Cloudflare Pages compatible
- Lightweight
- Accessible
- Maintainable

---

# Scope

Implement:

- Enhanced Markdown rendering
- Improved code blocks
- Copy Code button
- Language label on every code block
- Optional filename support
- Line highlighting support
- Mermaid diagram rendering
- Heading anchor links
- Reading progress indicator
- Estimated reading time
- Improved blockquotes
- Improved tables
- Admonition blocks
- Image captions
- Responsive image handling
- External link indicator

---

# Code Blocks

Every fenced code block must support:

- Syntax highlighting
- Copy button
- Language label
- Horizontal scrolling
- Responsive layout

Optional support:

- Filename display
- Highlighted lines

---

# Mermaid

Support Mermaid diagrams everywhere Markdown is rendered.

Support at least:

- flowchart
- sequenceDiagram
- classDiagram
- stateDiagram
- erDiagram
- journey
- gitGraph

Render diagrams automatically.

---

# Admonitions

Implement reusable callout blocks.

Support:

- Note
- Tip
- Info
- Warning
- Danger
- Success

Reuse a single component.

---

# Heading Anchors

Automatically generate anchor links for:

- H2
- H3
- H4

Requirements:

- Hover visibility
- Click to copy URL
- Accessible labels

---

# Reading Progress

Display a slim progress bar indicating reading position.

Requirements:

- Top of page
- Smooth updates
- Lightweight implementation

---

# Reading Time

Automatically calculate estimated reading time.

Display near:

- Title
- Published date
- Updated date

---

# Tables

Improve table rendering.

Requirements:

- Responsive
- Horizontal scrolling
- Consistent spacing
- Accessible markup

---

# Images

Improve image presentation.

Support:

- Captions
- Alt text
- Responsive sizing
- Lazy loading

---

# External Links

Automatically identify external links.

Display:

- External link icon
- Opens in new tab
- Secure attributes

---

# Accessibility

Support:

- WCAG 2.2 AA
- Keyboard navigation
- Screen readers
- Semantic HTML
- Proper focus states

---

# Performance

Requirements:

- Minimal JavaScript
- Lazy loading where appropriate
- Excellent Lighthouse scores
- Preserve fast static generation

---

# Design Requirements

Reuse:

- Existing typography
- Existing spacing
- Existing color palette
- Existing component library

Do not redesign the UI.

---

# Validation

Run:

```bash
npm install
npm run check
npm run lint
npm run format
npm run build
npm run preview
```

Verify:

- Code blocks
- Mermaid diagrams
- Copy button
- Reading progress
- Reading time
- Tables
- Images
- Anchor links
- Admonitions
- Responsive layouts

---

# Deliverables

Provide:

1. Components created
2. Components updated
3. Markdown enhancements
4. Accessibility summary
5. Performance considerations
6. Validation results

---

# Out of Scope

Do not implement:

- Authentication
- AI features
- Analytics
- Comments
- Content generation
- Design redesign

---

# Additional Implementation Instructions

1. Reuse Astro components wherever possible.

2. Reuse existing Markdown pipeline.

3. Minimize client-side JavaScript.

4. Keep every enhancement reusable.

5. Preserve compatibility with all existing content.

6. Do not require authors to change existing Markdown files.

7. Every enhancement should work automatically.

8. Maintain Cloudflare Pages compatibility.

9. Do not modify existing content.

10. Preserve PTKP's minimalist engineering aesthetic.

---

# Definition of Done

This milestone is complete only when:

- Documentation pages provide a significantly improved reading experience.
- All enhancements work automatically.
- Accessibility requirements are satisfied.
- Build, lint, formatting, and type checks pass.
- Cloudflare Pages compatibility is preserved.
- No regressions are introduced.