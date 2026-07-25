# PTKP Implementation Prompt

Milestone: 18

Name: Accessibility Polish

Status: Approved

---

# Purpose

Perform a comprehensive accessibility review and implementation across the Personal Technical Knowledge Platform (PTKP) to achieve a consistent WCAG 2.2 AA compliant experience while preserving the existing architecture, design language, and static-first philosophy.

This milestone improves usability for everyone.

Do not redesign the platform.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/ACCESSIBILITY.md
- docs/DESIGN_SYSTEM.md
- docs/COMPONENT_SPEC.md
- docs/CODING_STANDARDS.md
- docs/PERFORMANCE.md

These documents are authoritative.

---

# Objective

Review every page, layout and reusable component for accessibility and resolve all identified issues.

The implementation must remain fully compatible with Astro and Cloudflare Pages.

---

# Scope

Review and improve:

- Semantic HTML
- Landmark regions
- Heading hierarchy
- Keyboard navigation
- Focus visibility
- Focus management
- Skip links
- Form accessibility
- Button accessibility
- Link accessibility
- Table accessibility
- Code block accessibility
- Color contrast
- Motion preferences
- Screen reader support
- ARIA usage
- Touch target sizing

---

# Semantic HTML

Review every page.

Ensure correct use of:

- header
- nav
- main
- aside
- section
- article
- footer

Remove unnecessary div wrappers where semantic elements are appropriate.

---

# Heading Structure

Ensure:

- Only one H1 per page
- Logical H2–H6 hierarchy
- No skipped heading levels

---

# Keyboard Navigation

Verify every interactive element can be used without a mouse.

Requirements:

- Visible focus indicators
- Logical tab order
- No keyboard traps
- Escape closes dialogs
- Enter and Space activate controls

---

# Focus Management

Review:

- Search dialog
- Mobile navigation
- Table of Contents
- Back-to-top button
- Any future modal components

Focus must move predictably.

---

# Links

Review all links.

Ensure:

- Descriptive text
- Accessible labels
- External links identified
- No empty links

---

# Buttons

Ensure every button has:

- Accessible name
- Keyboard support
- Minimum touch target of 44×44 px where practical

---

# Images

Ensure:

- Meaningful alt text
- Decorative images marked appropriately
- Captions where useful

---

# Tables

Ensure:

- Table headers
- Scope attributes
- Responsive behavior
- Keyboard accessibility

---

# Code Blocks

Ensure:

- Copy button is keyboard accessible
- Screen reader labels
- Horizontal scrolling remains accessible

---

# Motion

Respect:

```css
prefers-reduced-motion
```

Reduce or disable non-essential animations.

---

# Color Contrast

Review the complete design system.

Ensure all text and interactive elements satisfy WCAG 2.2 AA contrast requirements.

---

# ARIA

Review all ARIA usage.

Remove unnecessary ARIA.

Add only where semantic HTML is insufficient.

---

# Accessibility Testing

Test:

- Keyboard only
- Screen reader compatibility
- Lighthouse Accessibility
- Responsive layouts
- High zoom levels (200%)

---

# Performance

Accessibility improvements must not reduce performance.

Maintain excellent Lighthouse Performance.

---

# Design Requirements

Do not redesign the UI.

Reuse existing:

- Components
- Typography
- Color palette
- Design tokens

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

Perform:

- Lighthouse Accessibility audit
- Keyboard navigation audit
- Manual accessibility review

---

# Deliverables

Provide:

1. Accessibility issues identified
2. Accessibility issues resolved
3. Components updated
4. WCAG compliance summary
5. Lighthouse Accessibility score
6. Validation results

---

# Out of Scope

Do not implement:

- New features
- UI redesign
- Content changes
- Analytics
- Authentication

---

# Additional Implementation Instructions

1. Prefer semantic HTML over ARIA.
2. Preserve the current visual identity.
3. Keep JavaScript minimal.
4. Ensure all improvements are reusable.
5. Maintain Cloudflare Pages compatibility.
6. Do not modify existing content.
7. Avoid unnecessary dependencies.
8. Document any remaining accessibility limitations.

---

# Definition of Done

This milestone is complete only when:

- WCAG 2.2 AA issues have been addressed.
- Lighthouse Accessibility score is excellent.
- Keyboard navigation works across the platform.
- Screen reader support is verified.
- Build, lint, format and type checks pass.
- Cloudflare Pages compatibility is preserved.
- No regressions are introduced.