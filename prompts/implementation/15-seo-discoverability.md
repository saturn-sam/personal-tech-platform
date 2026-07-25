# PTKP Implementation Prompt

Milestone: 15

Name: SEO & Discoverability

Status: Approved

---

# Purpose

Improve the discoverability, sharing experience, and search engine optimization of the Personal Technical Knowledge Platform (PTKP).

The implementation must preserve the existing architecture, design system, and static-first philosophy.

This milestone improves metadata, indexing, and discoverability only.

No redesign is permitted.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/CONTENT_MODEL.md
- docs/DESIGN_SYSTEM.md
- docs/PERFORMANCE.md
- docs/ACCESSIBILITY.md
- docs/CODING_STANDARDS.md

These documents are authoritative.

---

# Objective

Implement production-grade SEO capabilities suitable for a professional technical knowledge platform.

The implementation must remain fully compatible with Astro static generation and Cloudflare Pages.

---

# Scope

Implement:

- Dynamic page metadata
- Canonical URLs
- Open Graph metadata
- Twitter/X Card metadata
- robots.txt
- sitemap.xml
- RSS feed
- JSON-LD structured data
- Automatic metadata generation
- Favicon and web manifest validation
- Social preview optimization

---

# Metadata

Every page must automatically generate:

- title
- description
- canonical URL
- author
- robots
- keywords
- language

Use frontmatter where available.

Fallback gracefully.

---

# Open Graph

Generate:

- og:title
- og:description
- og:type
- og:url
- og:image
- og:site_name
- og:locale

Every content page must support Open Graph.

---

# Twitter/X Cards

Generate:

- summary_large_image
- title
- description
- image

Support modern X (Twitter) metadata.

---

# Canonical URLs

Every page must include a canonical URL.

Prevent duplicate indexing.

---

# Sitemap

Generate automatically.

Include:

- Homepage
- Articles
- Lab Notes
- Projects
- Technologies
- Certifications
- Resources
- Learning Paths

Exclude:

- Draft content
- Archived content
- 404 page

---

# robots.txt

Generate automatically.

Allow indexing of public content.

Reference the sitemap.

---

# RSS Feed

Generate a valid RSS feed.

Include:

- Articles
- Lab Notes
- Architecture Guides

Support:

- title
- description
- publication date
- updated date
- link

---

# Structured Data

Implement JSON-LD where appropriate.

Support:

- WebSite
- WebPage
- Article
- TechArticle
- BreadcrumbList
- Person

Generate automatically.

---

# Social Sharing

Ensure every page produces rich previews when shared.

Use fallback images where no page-specific image exists.

---

# Accessibility

Metadata implementation must not negatively impact accessibility.

Maintain WCAG 2.2 AA compliance.

---

# Performance

Requirements:

- Static generation
- No runtime metadata generation
- Minimal build overhead
- Excellent Lighthouse SEO score

---

# Design Requirements

No visual redesign.

Any visible additions must integrate with the existing design language.

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

- Metadata
- Open Graph
- Twitter Cards
- Canonical URLs
- Sitemap
- robots.txt
- RSS feed
- Structured Data
- Lighthouse SEO

---

# Deliverables

Provide:

1. Components created
2. Components updated
3. Metadata architecture
4. Structured data implementation
5. RSS implementation
6. Validation results

---

# Out of Scope

Do not implement:

- Analytics
- Cookie banners
- User tracking
- AI-generated metadata
- Content changes
- UI redesign

---

# Additional Implementation Instructions

1. Use Astro's built-in capabilities wherever possible.

2. Generate all metadata statically.

3. Avoid duplicate metadata generation.

4. Ensure every content collection is supported.

5. Reuse existing layout components.

6. Preserve Cloudflare Pages compatibility.

7. Do not modify existing content.

8. Ensure implementation scales to thousands of pages.

9. Validate generated XML.

10. Maintain excellent Lighthouse SEO performance.

---

# Definition of Done

This milestone is complete only when:

- Every public page has complete SEO metadata.
- Sitemap and RSS are generated automatically.
- Structured data validates correctly.
- Lighthouse SEO score is excellent.
- Build, lint, format, and type checks pass.
- Cloudflare Pages compatibility is preserved.
- No regressions are introduced.