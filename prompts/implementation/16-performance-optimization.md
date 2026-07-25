# PTKP Implementation Prompt

Milestone: 16

Name: Performance Optimization

Status: Approved

---

# Purpose

Optimize the Personal Technical Knowledge Platform (PTKP) for production-grade performance while preserving the existing architecture, design language, accessibility, and Cloudflare Pages compatibility.

This milestone focuses exclusively on improving loading speed, rendering efficiency, and build performance.

Do not redesign the platform.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/DESIGN_SYSTEM.md
- docs/PERFORMANCE.md
- docs/ACCESSIBILITY.md
- docs/CODING_STANDARDS.md
- docs/DEPLOYMENT_RUNBOOK.md

These documents are authoritative.

---

# Objective

Optimize PTKP to achieve excellent performance across desktop and mobile devices while maintaining a fully static architecture.

---

# Scope

Implement:

- Image optimization
- Font optimization
- CSS optimization
- JavaScript optimization
- Bundle optimization
- Lazy loading
- Route prefetch optimization
- Asset caching improvements
- Build optimization
- Lighthouse performance improvements

---

# Image Optimization

Implement:

- Astro Image where appropriate
- Responsive image generation
- Modern formats (WebP/AVIF where supported)
- Lazy loading for content images
- Explicit width and height
- Prevent layout shifts

Do not reduce visual quality unnecessarily.

---

# Font Optimization

Optimize fonts by:

- Self-hosting where practical
- Preloading critical fonts
- Reducing font requests
- Using efficient fallback stacks
- Eliminating unused font assets

---

# CSS Optimization

Optimize styles by:

- Removing unused CSS
- Reducing duplication
- Preserving design tokens
- Maintaining responsive behavior
- Avoiding unnecessary specificity

---

# JavaScript Optimization

Requirements:

- Reduce client-side JavaScript
- Hydrate only interactive components
- Remove unused scripts
- Lazy-load interactive modules
- Prefer Astro islands where appropriate

---

# Bundle Optimization

Review all dependencies.

Remove:

- Unused packages
- Duplicate libraries
- Redundant utilities

Split large bundles where appropriate.

---

# Route Optimization

Optimize:

- Route prefetching
- Static asset loading
- Navigation performance

Do not introduce unnecessary network requests.

---

# Build Optimization

Improve:

- Build efficiency
- Static generation speed
- Asset organization

Avoid changes that negatively affect maintainability.

---

# Accessibility

Performance improvements must not reduce accessibility.

Maintain:

- WCAG 2.2 AA compliance
- Keyboard navigation
- Screen reader compatibility

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

Measure:

- Lighthouse Performance
- Lighthouse Accessibility
- Lighthouse Best Practices
- Lighthouse SEO

Verify:

- Desktop
- Tablet
- Mobile

---

# Deliverables

Provide:

1. Components updated
2. Performance improvements implemented
3. Bundle size improvements
4. Asset optimization summary
5. Lighthouse results
6. Validation results

---

# Out of Scope

Do not implement:

- New features
- Analytics
- Authentication
- UI redesign
- Content changes
- Architecture changes

---

# Additional Implementation Instructions

1. Prefer Astro-native optimizations.
2. Keep JavaScript to an absolute minimum.
3. Preserve existing layouts.
4. Preserve existing design system.
5. Maintain Cloudflare Pages compatibility.
6. Do not modify existing content.
7. Avoid introducing additional dependencies unless clearly justified.
8. Optimize for long-term maintainability.
9. Preserve excellent accessibility.
10. Do not introduce regressions.

---

# Definition of Done

This milestone is complete only when:

- Performance has measurably improved.
- Bundle size is optimized.
- Images and assets are optimized.
- Lighthouse scores improve or remain excellent.
- Build, lint, format, and type checks pass.
- Cloudflare Pages compatibility is preserved.
- No regressions are introduced.