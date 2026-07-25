# PTKP Implementation Prompt

Milestone: 19

Name: Production Hardening

Status: Approved

---

# Purpose

Prepare the Personal Technical Knowledge Platform (PTKP) for secure, reliable, long-term production deployment on Cloudflare Pages.

This milestone focuses on operational readiness, deployment security, caching, resilience, and production best practices.

Do not redesign the platform.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/DEPLOYMENT_RUNBOOK.md
- docs/OPERATIONS_RUNBOOK.md
- docs/BACKUP_AND_RECOVERY.md
- docs/PERFORMANCE.md
- docs/ACCESSIBILITY.md
- docs/CODING_STANDARDS.md

These documents are authoritative.

---

# Objective

Perform a production hardening pass to ensure PTKP is secure, maintainable, performant, and ready for public deployment.

The implementation must remain fully compatible with Astro static generation and Cloudflare Pages.

---

# Scope

Implement:

- Security headers
- Content Security Policy (CSP)
- HTTP security best practices
- Asset caching
- Cache-Control policies
- Compression verification
- Build validation
- Dead link detection
- Broken asset detection
- Production configuration review
- Dependency audit
- Deployment validation

---

# Security Headers

Configure appropriate headers where supported.

Review:

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- X-Frame-Options (or CSP equivalent)
- Strict-Transport-Security (when applicable)

Do not weaken browser security.

---

# Content Security Policy

Implement a restrictive CSP compatible with PTKP.

Requirements:

- No unsafe inline scripts unless unavoidable.
- Allow only required asset sources.
- Document any required exceptions.

---

# Caching

Review caching strategy.

Optimize:

- HTML
- CSS
- JavaScript
- Images
- Fonts
- Static assets

Use content-hashed assets where appropriate.

---

# Asset Validation

Verify:

- No missing assets
- No broken image references
- No broken favicon references
- No broken manifest references

---

# Link Validation

Validate:

- Internal links
- Navigation links
- Footer links
- Cross-content references

Do not modify user-authored external URLs.

---

# Dependency Audit

Review project dependencies.

Identify:

- Deprecated packages
- Unused packages
- Duplicate packages
- Security advisories

Recommend remediation where necessary.

---

# Build Validation

Perform a clean production build.

Verify:

- Zero build errors
- Zero broken routes
- Static generation success
- Expected output structure

---

# Deployment Validation

Confirm compatibility with:

- Cloudflare Pages
- Static hosting
- HTTPS
- Browser caching

---

# Accessibility

Production hardening must not reduce accessibility.

Maintain WCAG 2.2 AA compliance.

---

# Performance

Ensure production hardening preserves:

- Excellent Lighthouse Performance
- Excellent Lighthouse Accessibility
- Excellent Lighthouse SEO
- Excellent Lighthouse Best Practices

---

# Design Requirements

No UI redesign.

No layout changes.

No content changes.

---

# Validation

Run:

```bash
npm install
npm audit
npm run check
npm run lint
npm run format
npm run build
npm run preview
```

Verify:

- Build succeeds
- Security headers configured
- CSP valid
- No broken links
- No broken assets
- Cache configuration
- Cloudflare compatibility

---

# Deliverables

Provide:

1. Security improvements
2. Production configuration summary
3. Dependency audit summary
4. Link validation summary
5. Asset validation summary
6. Validation results

---

# Out of Scope

Do not implement:

- New features
- UI redesign
- Content generation
- Analytics
- Authentication
- Server-side functionality

---

# Additional Implementation Instructions

1. Preserve the existing architecture.
2. Preserve the design system.
3. Keep JavaScript minimal.
4. Do not modify existing content.
5. Maintain Cloudflare Pages compatibility.
6. Reuse existing components.
7. Avoid unnecessary dependencies.
8. Follow security best practices.
9. Document any recommended future improvements.
10. Do not introduce regressions.

---

# Definition of Done

This milestone is complete only when:

- Production configuration is hardened.
- Security best practices are implemented.
- Dependency audit is completed.
- Build, lint, format and type checks pass.
- Cloudflare Pages compatibility is verified.
- Lighthouse scores remain excellent.
- No regressions are introduced.