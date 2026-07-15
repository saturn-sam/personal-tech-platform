# PTKP Implementation Prompt

Milestone: 5

Name: Homepage

Status: Approved

---

# Purpose

Implement the homepage of the Personal Technical Knowledge Platform (PTKP).

The homepage is the entry point to the platform. It must introduce the platform, showcase curated technical knowledge, and guide visitors toward deeper content.

This is **not** a personal portfolio and **not** a commercial landing page.

The homepage should communicate professionalism, technical depth, and clarity.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/INFORMATION_ARCHITECTURE.md
- docs/DESIGN_SYSTEM.md
- docs/COMPONENT_SPEC.md
- docs/VOICE_AND_WRITING.md
- docs/ACCESSIBILITY.md
- docs/PERFORMANCE.md
- docs/SEO_GUIDE.md

These documents are authoritative.

---

# Objective

Create a calm, typography-driven homepage that encourages visitors to explore knowledge rather than consume marketing.

The implementation must use only the reusable layout and UI components created in previous milestones.

Do not create homepage-specific UI primitives.

---

# Design Philosophy

The homepage should feel similar to excellent technical documentation rather than a corporate website.

Characteristics:

- Simple
- Elegant
- Spacious
- Minimal
- Fast
- Content-first
- No unnecessary animation
- No marketing language
- No promotional banners
- No exaggerated claims

The content is the visual focus.

---

# Homepage Structure

Implement the homepage in the following order.

## 1. Hero

Include:

- Name
- Professional title
- Short technical introduction
- Primary navigation to Articles
- Secondary navigation to Projects

Example positioning:

> Infrastructure Engineer, Kubernetes Architect, and Technical Knowledge Author focused on building secure, resilient, and automated enterprise platforms.

Do not use marketing slogans.

---

## 2. Featured Knowledge

Display a curated selection of featured knowledge assets.

Initially include placeholder cards sourced from the content collections.

The section must support future automatic population.

---

## 3. Featured Projects

Display selected engineering projects.

Include realistic placeholder projects such as:

- VMware Cloud Foundation Datacenter
- Enterprise Kubernetes Platform
- Dell PowerFlex with OpenShift Virtualization
- GitLab CI/CD Platform
- Django Infrastructure Monitoring System

Each project card should include:

- Title
- Short description
- Technologies
- Link placeholder

---

## 4. Technology Overview

Display technologies grouped by category.

Example categories:

Infrastructure

Virtualization

Containers

Cloud

DevOps

Programming

Databases

Monitoring

Networking

Do not display logos.

Use clean text-based badges or chips.

---

## 5. Certifications

Display selected certifications.

Examples include:

- Kubestronaut
- CKA
- CKAD
- CKS
- KCNA
- KCSA
- AWS Solutions Architect Associate

Support future expansion through Content Collections.

---

## 6. Recent Updates

Display recent articles or lab notes.

Initially use placeholder content.

Prepare for automatic population later.

---

## 7. Footer

Include:

- Copyright
- GitHub
- LinkedIn
- RSS (placeholder)
- Email contact (optional if documented)

Keep the footer minimal.

---

# Content

Use realistic content based on the project purpose.

Avoid:

- Lorem Ipsum
- Dummy paragraphs
- Marketing copy

The homepage should already feel like an active knowledge platform.

---

# Accessibility

The homepage must:

- Use semantic HTML
- Contain exactly one H1
- Follow heading hierarchy
- Support keyboard navigation
- Maintain visible focus indicators
- Meet WCAG 2.2 AA

---

# Performance

The homepage should:

- Hydrate only interactive components
- Avoid unnecessary JavaScript
- Minimize layout shift
- Optimize images
- Prefer static rendering

---

# SEO

Implement:

- Page title
- Meta description
- Open Graph metadata
- Canonical URL support
- Structured heading hierarchy

Do not implement sitemap or RSS generation in this milestone.

---

# Deliverables

Create:

- Homepage implementation
- Required layout composition
- Section organization
- Placeholder content integration
- Responsive layouts

Reuse existing components.

---

# Validation

Before completing the task verify:

- npm run dev succeeds
- npm run build succeeds
- npm run check succeeds
- Linting passes
- Formatting passes
- Responsive layouts verified
- Keyboard navigation verified
- Lighthouse Accessibility score ≥95
- Lighthouse Performance score ≥95 (development expectations may vary)

---

# Out of Scope

Do not implement:

- Search
- Article pages
- Project pages
- Technology pages
- Certification pages
- RSS
- Sitemap
- Analytics
- Comments
- Authentication

---

# Expected Output

Provide:

1. Summary of implementation
2. Homepage component tree
3. Responsive behavior summary
4. Accessibility considerations
5. Performance considerations
6. SEO implementation summary
7. Assumptions requiring approval

Do not implement anything beyond this milestone.

---

# Definition of Done

This milestone is considered complete only when:

- All required deliverables are implemented.
- The implementation complies with the project specifications.
- No placeholder UI components are introduced outside the defined scope.
- Type checking, linting, formatting, and build all succeed.
- Accessibility requirements are satisfied.
- No known defects remain within the milestone scope.