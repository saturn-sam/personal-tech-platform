# PTKP Deployment Runbook

Version: 1.0

Status: Approved

---

# Purpose

Define the production deployment procedure for the Personal Technical Knowledge Platform (PTKP).

This runbook is the authoritative deployment guide for Cloudflare Pages.

---

# Deployment Target

Platform:

- Cloudflare Pages

Framework:

- Astro

Deployment Type:

- Static Site Generation (SSG)

---

# Repository

Source Control:

GitHub

Default Branch:

main

Development Branch:

develop

---

# Deployment Workflow

Implementation

↓

Feature Branch

↓

Pull Request

↓

Review

↓

Merge to develop

↓

Integration Validation

↓

Merge to main

↓

Automatic Cloudflare Deployment

↓

Production Validation

---

# Build Configuration

Build Command

```bash
npm run build
```

Build Output

```text
dist/
```

Node Version

Use the version specified in `.nvmrc` or the project configuration.

Package Manager

npm

---

# Environment Variables

Production environment variables must be managed through Cloudflare Pages.

Do not store secrets in the repository.

Document every environment variable in this file.

---

# Pre-Deployment Checklist

Verify:

- npm install
- npm audit
- npm run check
- npm run lint
- npm run format
- npm run build
- npm run preview

Confirm:

- No build warnings
- No TypeScript errors
- No lint errors
- Post-build production validation succeeds

---

# Deployment Steps

1. Merge into `main`.
2. Confirm GitHub synchronization.
3. Verify Cloudflare Pages build starts.
4. Monitor build logs.
5. Confirm deployment succeeds.
6. Validate production site.

---

# Post-Deployment Validation

Verify:

- Homepage
- Navigation
- Articles
- Projects
- Technologies
- Certifications
- Resources
- Search
- RSS (when implemented)
- Sitemap
- robots.txt
- Security headers
- CSP header and HTML meta policy
- Cache headers

---

# Security Headers

Production builds must emit a hardened `dist/_headers` file for Cloudflare Pages and inject a page-specific CSP meta tag into every generated HTML document.

The generated `_headers` file must include:

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- X-Frame-Options
- Strict-Transport-Security

The HTTP-delivered CSP should remain short and carry directives that must be enforced as response headers, including clickjacking protection. Page-specific inline script authorization should be emitted as build-time hashes in the generated HTML meta policy.

This split is required because Cloudflare Pages enforces a 2000-character limit on individual `_headers` lines.

---

# Static Validation

`npm run build` must complete with post-build validation that verifies:

- Internal links
- Generated routes
- Search index links
- Manifest references
- Favicon references
- Sitemap references
- Missing local assets

Validation failures should block deployment.

---

# Performance Validation

Confirm:

- Lighthouse Performance ≥95
- Lighthouse Accessibility ≥100
- Lighthouse Best Practices ≥95
- Lighthouse SEO ≥95

Document any deviations.

Verify Cloudflare compression remains active for HTML, CSS, JavaScript, JSON, XML, text, and SVG assets.

---

# Rollback Procedure

If deployment fails:

1. Identify failed release.
2. Restore previous production commit.
3. Redeploy.
4. Validate production.
5. Document root cause.
6. Open corrective issue.

---

# Monitoring

Monitor:

- Build success
- Deployment duration
- Broken links
- Missing assets
- Header generation
- CSP regressions
- Search functionality
- Console errors

---

# Maintenance

Review deployment configuration:

- Monthly
- After Astro upgrades
- After Cloudflare Pages changes
- After major dependency updates

---

# Review Checklist

Deployment is complete only when:

- Build succeeds.
- Production validation succeeds.
- Documentation is updated.
- Release notes are published.
