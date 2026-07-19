# PTKP Maintenance Prompt

Task: Release Checklist

Status: Approved

---

# Purpose

Perform the final release validation for the Personal Technical Knowledge Platform (PTKP) before deploying a new production release.

No implementation or architectural changes are permitted during this process.

---

# Required Reading

Before beginning, read and follow:

- AGENTS.md
- docs/RELEASE_PROCESS.md
- docs/DEPLOYMENT_RUNBOOK.md
- docs/OPERATIONS_RUNBOOK.md
- docs/MAINTENANCE_SCHEDULE.md
- docs/TROUBLESHOOTING.md

These documents are authoritative.

---

# Objective

Verify that PTKP satisfies all release requirements and is ready for production deployment.

---

# Pre-Release Validation

Verify:

- Repository is synchronized.
- Working tree is clean.
- Version number updated.
- CHANGELOG updated.
- Documentation updated.

---

# Build Validation

Run:

```bash
npm install
npm run check
npm run lint
npm run format
npm run build
npm run preview
```

Resolve all issues before continuing.

---

# Functional Validation

Verify:

- Homepage
- Knowledge Assets
- Projects
- Technologies
- Certifications
- Resources
- Search
- Navigation
- Breadcrumbs
- Internal links

---

# Accessibility Validation

Confirm:

- Keyboard navigation
- Focus indicators
- Semantic HTML
- Heading hierarchy
- WCAG 2.2 AA compliance

---

# Performance Validation

Confirm:

- Build size acceptable
- Images optimized
- JavaScript minimized
- Lighthouse targets achieved

---

# SEO Validation

Verify:

- Metadata
- Canonical URLs
- Open Graph
- robots.txt
- sitemap.xml
- Structured headings

---

# Deployment Validation

Confirm:

- Cloudflare Pages configuration
- Build command
- Output directory
- Environment variables
- Asset paths

---

# Release Approval

Confirm:

- All validation steps passed.
- No critical defects remain.
- Documentation is current.
- Production deployment is approved.

---

# Deliverables

Provide:

1. Release summary
2. Validation results
3. Outstanding issues
4. Deployment approval status

---

# Out of Scope

Do not:

- Add features
- Refactor code
- Update dependencies
- Change architecture
- Modify layouts

---

# Expected Output

Provide the completed release validation report and indicate whether the release is approved for production deployment.