# PTKP Implementation Prompt

Milestone: 17

Name: Error Experience

Status: Approved

---

# Purpose

Implement a polished, user-friendly error experience for the Personal Technical Knowledge Platform (PTKP) while preserving the existing architecture, design language, accessibility, and static-first philosophy.

This milestone focuses on improving the user experience when content or pages cannot be found.

Do not redesign the platform.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/DESIGN_SYSTEM.md
- docs/ACCESSIBILITY.md
- docs/CODING_STANDARDS.md
- docs/PERFORMANCE.md

These documents are authoritative.

---

# Objective

Create a professional error experience that helps users recover gracefully from navigation errors, missing content, and invalid URLs.

The implementation must remain fully compatible with Astro static generation and Cloudflare Pages.

---

# Scope

Implement:

- Custom 404 page
- Reusable empty state component
- Missing content handling
- Helpful recovery actions
- Search shortcut on 404 page
- Suggested navigation
- Consistent error styling
- Accessible error pages

---

# Custom 404 Page

Implement a professional 404 page.

Requirements:

- Friendly headline
- Brief explanation
- Return to Home button
- Search button
- Links to:
  - Articles
  - Projects
  - Technologies
  - Certifications
  - Resources
- Consistent branding
- Responsive layout

---

# Empty State Component

Create a reusable component for situations where:

- No search results
- Empty collection
- No related content
- Missing tags
- Missing categories

Component must support:

- Title
- Description
- Optional icon
- Primary action
- Secondary action

---

# Missing Content Handling

Where content relationships reference missing items:

- Fail gracefully
- Do not break rendering
- Hide invalid links
- Log warnings during build if appropriate

---

# Recovery Actions

Whenever possible, provide users with ways to continue:

- Back to Home
- Browse Articles
- Browse Projects
- Browse Technologies
- Browse Certifications
- Browse Resources
- Search

---

# Accessibility

Support:

- Semantic HTML
- Screen reader labels
- Keyboard navigation
- WCAG 2.2 AA
- Proper focus management

---

# Performance

Requirements:

- Static pages
- Minimal JavaScript
- Reusable components
- No unnecessary dependencies

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

- Invalid routes display the custom 404 page
- Empty state component renders correctly
- Missing related content does not break pages
- Recovery links work correctly
- Responsive layouts
- Accessibility

---

# Deliverables

Provide:

1. Components created
2. Pages created
3. Error handling improvements
4. Accessibility summary
5. Validation results

---

# Out of Scope

Do not implement:

- Server-side error pages
- Authentication errors
- API error handling
- Analytics
- UI redesign
- Content changes

---

# Additional Implementation Instructions

1. Reuse existing layout components.
2. Keep JavaScript minimal.
3. Use reusable components.
4. Preserve Cloudflare Pages compatibility.
5. Maintain the established PTKP design language.
6. Do not modify existing content.
7. Avoid unnecessary dependencies.
8. Ensure graceful degradation.

---

# Definition of Done

This milestone is complete only when:

- Custom 404 page is fully implemented.
- Empty state component is reusable.
- Missing content is handled gracefully.
- Build, lint, format, and type checks pass.
- Accessibility requirements are satisfied.
- Cloudflare Pages compatibility is preserved.
- No regressions are introduced.