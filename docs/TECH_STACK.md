# Technology Stack

Version: 1.0

Status: Active

---

# Purpose

This document defines the approved technology stack for the Personal Technical Knowledge Platform (PTKP).

Every framework, library, service, and external dependency must be documented with its purpose and selection rationale.

The goals are:

- Maintain architectural consistency
- Prevent unnecessary dependencies
- Simplify long-term maintenance
- Support Cloudflare Pages deployment
- Enable reproducible development

Any technology not documented here should be considered unapproved until reviewed.

---

# Architecture Overview

PTKP is built using a static-first architecture.

Core principles:

- Static Site Generation (SSG)
- Content-first development
- Markdown/MDX as the primary content source
- Minimal client-side JavaScript
- Progressive enhancement
- Cloud-native deployment using Cloudflare Pages

---

# Approved Technology Stack

| Technology | Purpose | Status |
|------------|---------|--------|
| Astro | Static site framework | Approved |
| TypeScript | Type safety | Approved |
| Tailwind CSS | Styling system | Approved |
| MDX | Rich technical content | Approved |
| Astro Content Collections | Structured content management | Approved |
| Pagefind | Client-side search | Approved |
| Mermaid | Architecture and technical diagrams | Approved |
| Shiki | Syntax highlighting | Approved |
| GitHub | Source code hosting | Approved |
| GitHub Actions | CI/CD automation | Approved |
| Cloudflare Pages | Hosting and deployment | Approved |

---

# Technology Decisions

## Astro

### Purpose

Provides a modern static site framework optimized for content-heavy websites.

### Why Selected

- Excellent performance
- Native Markdown and MDX support
- First-class Content Collections
- Excellent Cloudflare Pages support
- Minimal client-side JavaScript
- Flexible component model

### Alternatives Considered

- Next.js
- Hugo
- Docusaurus
- Eleventy

### Review Criteria

Re-evaluate only if Astro no longer satisfies long-term maintainability or Cloudflare compatibility.

---

## TypeScript

### Purpose

Improve code quality through static typing.

### Why Selected

- Detect errors during development
- Improve maintainability
- Better IDE support
- Strong ecosystem support

### Policy

Strict mode is mandatory.

Use explicit typing whenever practical.

---

## Tailwind CSS

### Purpose

Provide a consistent design system.

### Why Selected

- Utility-first workflow
- Excellent maintainability
- Responsive design support
- Reduced CSS duplication

### Policy

Avoid arbitrary values unless necessary.

Extract reusable UI patterns into components.

---

## MDX

### Purpose

Allow rich technical documentation with embedded components.

### Why Selected

- Markdown-first workflow
- Interactive documentation
- Mermaid integration
- Reusable callout components
- Flexible technical documentation

---

## Astro Content Collections

### Purpose

Provide validated, type-safe content management.

### Why Selected

- Schema validation
- Build-time error detection
- Type safety
- Excellent developer experience

### Policy

All Knowledge Assets must belong to a Content Collection.

---

## Pagefind

### Purpose

Provide fast, static full-text search.

### Why Selected

- No backend required
- Excellent search quality
- Cloudflare compatible
- Lightweight
- Easy integration

### Policy

Index all public Knowledge Assets.

---

## Mermaid

### Purpose

Create maintainable architecture diagrams using text.

### Why Selected

- Version controlled
- Markdown friendly
- Easy to update
- Consistent documentation

### Policy

Architecture Guides should prefer Mermaid diagrams over embedded images whenever practical.

---

## Shiki

### Purpose

Provide high-quality syntax highlighting.

### Why Selected

- Accurate highlighting
- Multiple language support
- Excellent integration with Astro

---

## GitHub

### Purpose

Source control and collaboration.

### Why Selected

- Industry standard
- Reliable
- Strong ecosystem
- GitHub Actions integration

### Policy

The `main` branch should always remain deployable.

---

## GitHub Actions

### Purpose

Continuous Integration and Continuous Deployment.

### Responsibilities

- Install dependencies
- Run linting
- Run type checking
- Validate content
- Build project
- Deploy to Cloudflare Pages

Build failures must block deployment.

---

## Cloudflare Pages

### Purpose

Host and deploy PTKP globally.

### Why Selected

- Global CDN
- Excellent performance
- Native GitHub integration
- Simple deployment workflow
- Cost-effective for static sites

---

# Deferred Technologies

The following technologies may be introduced in future versions if justified:

- Cloudflare Workers
- Cloudflare KV
- Cloudflare Analytics
- Cloudflare Web Analytics
- Cloudflare Turnstile
- Open Graph image generation
- RSS enhancements

These are intentionally excluded from Version 1.

---

# Rejected Technologies

The following are intentionally not included in Version 1:

## Headless CMS

Reason:

Content is managed through Git using Markdown and MDX.

---

## Relational Database

Reason:

Static content architecture does not require a database.

---

## Server-side Rendering (SSR)

Reason:

The platform prioritizes static generation for performance, simplicity, and reliability.

---

## Client-side Frameworks

Reason:

Avoid unnecessary JavaScript.

Interactive components should use Astro Islands only where needed.

---

# Dependency Approval Policy

Before introducing a new dependency, evaluate:

- Does it solve a real problem?
- Can the same result be achieved without it?
- Is it actively maintained?
- Is it compatible with Cloudflare Pages?
- Does it increase build complexity?
- Does it improve long-term maintainability?

If the answer to these questions is not satisfactory, the dependency should not be adopted.

---

# Upgrade Policy

Dependencies should be updated regularly but conservatively.

Major version upgrades require:

- Review of release notes
- Compatibility testing
- Build verification
- Performance validation

Avoid upgrading solely to follow trends.

---

# Security Policy

Dependencies should be:

- Actively maintained
- Free from known critical vulnerabilities
- Reviewed periodically

Unused dependencies should be removed promptly.

---

# Decision Authority

Changes to the technology stack must align with:

- PROJECT_SPEC.md
- PRINCIPLES.md
- ENGINEERING_STANDARDS.md

Technology choices should support the long-term goals of PTKP rather than short-term convenience.

---

# Final Principle

The technology stack exists to support the platform.

The platform should never become dependent on technology for its identity.

Knowledge is the product.

Technology is the enabling infrastructure.