# PTKP Implementation Prompt

Milestone: 12

Name: Navigation System

Status: Approved

---

# Purpose

Implement the complete navigation experience for the Personal Technical Knowledge Platform (PTKP).

The navigation system should make the platform feel like a professional technical documentation site while preserving the existing minimalist aesthetic.

This milestone improves usability only.

It must not redesign the platform.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/INFORMATION_ARCHITECTURE.md
- docs/COMPONENT_SPEC.md
- docs/DESIGN_SYSTEM.md
- docs/ACCESSIBILITY.md
- docs/PERFORMANCE.md
- docs/CODING_STANDARDS.md

These documents are authoritative.

---

# Objective

Implement a complete navigation system that is:

- intuitive
- responsive
- keyboard accessible
- fully static
- reusable
- compatible with Cloudflare Pages

Navigation should behave consistently across the entire platform.

---

# Scope

Implement:

- Global Header
- Global Footer
- Primary Navigation
- Mobile Navigation
- Breadcrumb Navigation
- Previous / Next Navigation
- Documentation Sidebar
- Sticky Header
- Active Navigation Highlighting
- Auto-generated Table of Contents
- Back to Top Button
- Skip to Content link
- Consistent navigation for all layouts

---

# Header

Implement a responsive header.

Desktop:

- Logo
- Home
- Articles
- Projects
- Technologies
- Certifications
- Resources
- Search
- Theme Toggle

Mobile:

- Hamburger menu
- Slide-over navigation
- Keyboard accessible
- Focus trap
- Escape closes menu

---

# Breadcrumbs

Automatically generate breadcrumbs.

Example:

Home

↓

Technologies

↓

Kubernetes

↓

Networking

Breadcrumbs must support every content collection.

---

# Sidebar Navigation

Documentation pages should display:

- Current section
- Current page
- Child pages
- Active section highlighting

Sidebar should remain visible on desktop.

Collapsed on mobile.

---

# Table of Contents

Generate automatically from headings.

Requirements:

- H2-H4 support
- Active heading highlighting
- Smooth scrolling
- Sticky positioning
- Accessible navigation

---

# Previous / Next Navigation

Display at bottom of content.

Support:

- Articles
- Architecture Guides
- Learning Paths
- Technologies

Automatically determine neighboring pages.

---

# Back To Top

Implement:

- Floating button
- Appears after scrolling
- Smooth scroll
- Keyboard accessible

---

# Footer

Footer should contain:

Platform

- About
- Projects
- Articles

Knowledge

- Technologies
- Certifications
- Resources

Social

- GitHub
- LinkedIn

Copyright

Built with Astro.

Designed for engineers.

---

# Accessibility

Support:

- Skip navigation link
- Semantic landmarks
- Keyboard navigation
- Screen reader labels
- Focus management
- WCAG 2.2 AA

---

# Performance

Requirements:

- No unnecessary hydration
- Lazy-load interactive components
- Minimal JavaScript
- Tree-shake unused code

---

# Design Requirements

Do NOT redesign the platform.

Reuse:

- Existing typography
- Existing spacing
- Existing color palette
- Existing components
- Existing tokens

Navigation should blend naturally with the existing PTKP design.

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

- Desktop navigation
- Tablet navigation
- Mobile navigation
- Breadcrumbs
- Sidebar
- Table of Contents
- Previous / Next
- Back To Top
- Keyboard navigation
- Responsive layouts

---

# Deliverables

Provide:

1. Components created
2. Components updated
3. Navigation architecture
4. Accessibility summary
5. Performance considerations
6. Validation results

---

# Out of Scope

Do not implement:

- Authentication
- User profiles
- Analytics
- Comments
- AI features
- Content changes
- Design redesign
- New content collections

---

# Additional Implementation Instructions

1. Use Astro components wherever possible.

2. Keep JavaScript to an absolute minimum.

3. Use CSS for interactions where practical.

4. Maintain excellent Lighthouse scores.

5. Reuse the existing component library.

6. Navigation should work correctly even if JavaScript is disabled wherever possible.

7. Sidebar, Table of Contents, and Previous/Next navigation must be automatically generated from the existing content collections.

8. Ensure the navigation system scales gracefully as the platform grows to hundreds of articles, projects, and technology pages.

9. Do not modify existing content. Implement only the navigation system.

10. Do not redesign the visual identity of PTKP. Preserve the established design language.

---

# Definition of Done

This milestone is complete only when:

- Navigation works consistently across all layouts.
- All navigation elements are responsive.
- Accessibility requirements are satisfied.
- Build, lint, format, and type checks pass.
- Cloudflare Pages compatibility is preserved.
- No regressions are introduced.