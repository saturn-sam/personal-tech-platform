# PTKP Implementation Prompt

Milestone: 22 (Post-v1 Feature)

Name: About Me Page

Status: Approved

---

# Purpose

Replace the existing "About" page with a fully configurable "About Me" page.

This page should become the personal biography and professional profile of the site owner. It must present a complete story rather than a short profile.

The page should be content-driven, not hardcoded.

---

# Primary Goal

Design and implement an About Me system that allows the site owner to maintain a complete personal story without modifying page code.

All content must come from a single structured content source.

---

# Required Reading

Before implementation, review:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/DESIGN_SYSTEM.md
- docs/CONTENT_MODEL.md
- docs/COMPONENT_SPEC.md
- docs/ACCESSIBILITY.md
- docs/PERFORMANCE.md

Understand the existing architecture before making changes.

---

# General Requirements

The About Me page must:

- Preserve the current design language
- Preserve typography
- Preserve spacing system
- Preserve color palette
- Preserve responsive behavior
- Preserve accessibility
- Preserve performance

Do not redesign the website.

Improve only the About page.

---

# Content Driven

The page must NOT contain hardcoded text.

Instead, create a dedicated content source.

Recommended structure:

src/content/about/

about.mdx

The page must render the content dynamically.

Future editing should only require modifying the MDX file.

No component code should require editing.

---

# Information Architecture

The page should support the following sections.

Order may be adjusted if appropriate.

1. Hero

Include:

- Full Name
- Professional Title
- Short Introduction
- Professional Photograph
- Current Position
- Current Organization
- Location

---

2. Professional Summary

A detailed narrative describing:

- Professional identity
- Engineering philosophy
- Areas of expertise
- Current responsibilities
- Technical interests

Long-form content is expected.

---

3. Personal Story

A chronological story describing:

- Childhood interest in technology
- Education
- First professional experience
- Career progression
- Current role
- Long-term vision

Support multiple paragraphs.

---

4. Career Timeline

Display major milestones chronologically.

Example:

Year

Role

Organization

Highlights

The implementation must support an arbitrary number of entries.

---

5. Technical Expertise

Display categorized skills.

Examples:

Infrastructure

Virtualization

Containers

Cloud

Storage

Networking

Programming

Automation

Operating Systems

Security

Monitoring

DevOps

The implementation must support adding and removing categories without code changes.

---

6. Certifications

Display certifications automatically.

Prefer reusing existing certification content collection.

Avoid duplicate data.

If reuse is not possible, explain why.

---

7. Projects

Display selected featured projects.

Prefer reusing existing project collection.

Avoid duplicate content.

---

8. Learning Journey

Support a long-form section describing:

- Continuous learning
- Self-study
- Research
- Lab work
- Knowledge sharing

---

9. Achievements

Display:

- Certifications
- Awards
- Community recognition
- Publications
- Badges
- Significant accomplishments

Must support an arbitrary number of entries.

---

10. Philosophy

A long-form section explaining:

- Engineering philosophy
- Leadership philosophy
- Problem-solving approach
- Learning philosophy

---

11. Personal Interests

Support:

- Hobbies
- Reading
- Technology interests
- Research interests
- Creative interests

---

12. Technology Stack

Display technologies grouped by category.

The page must support adding new technologies without modifying page code.

---

13. Current Focus

Describe:

- Current learning goals
- Active projects
- Research areas
- Future certifications

---

14. Contact

Display:

- Email
- GitHub
- LinkedIn
- Website
- Resume (optional)

Links must be configurable.

---

15. Call To Action

Provide a closing section encouraging visitors to:

- Read articles
- Explore projects
- Review certifications
- Contact the author

---

# Configuration

Every section must be configurable.

Allow:

- Reordering sections
- Hiding sections
- Adding new timeline entries
- Adding new achievements
- Updating technologies
- Updating biography

without changing page code.

---

# Component Design

Create reusable components.

Examples:

AboutHero

CareerTimeline

SkillCategory

AchievementGrid

TechnologyGrid

PersonalStory

CurrentFocus

ContactCard

Do not create large monolithic components.

---

# Content Relationships

Where possible, reuse existing content.

Examples:

Featured Certifications

Featured Projects

Featured Technologies

Featured Articles

Avoid maintaining duplicate information.

---

# Performance

Maintain:

- Static generation
- Minimal JavaScript
- Lazy-loaded images
- Optimized assets

---

# Accessibility

Maintain WCAG 2.2 AA compliance.

Support:

- Semantic HTML
- Keyboard navigation
- Screen readers
- Proper heading hierarchy

---

# Responsive Design

Support:

- Mobile
- Tablet
- Desktop
- Large screens

No horizontal scrolling.

---

# SEO

Generate:

- Metadata
- Open Graph
- Structured Data
- Canonical URL

Use the same SEO system already implemented.

---

# Deliverables

Provide:

1. Components created
2. Components updated
3. Content model
4. MDX content structure
5. Data flow
6. Responsive implementation summary
7. Accessibility summary

---

# Out of Scope

Do not:

- Redesign the site
- Change navigation
- Modify unrelated pages
- Introduce unnecessary dependencies
- Duplicate existing content

---

# Additional Implementation Instructions

1. Inspect the existing repository before implementation.

2. Follow existing coding standards.

3. Reuse existing layouts.

4. Reuse existing typography.

5. Reuse existing design tokens.

6. Keep the implementation content-driven.

7. Make every section configurable.

8. Reuse existing content collections whenever possible.

9. Do not hardcode personal information in components.

10. Keep the implementation maintainable for long-term use.

---

# Definition of Done

This milestone is complete only when:

- The About page is replaced with a configurable About Me page.
- All content is driven from structured content files.
- Existing design language is preserved.
- The page supports long-form personal storytelling.
- Related certifications, projects and technologies are reused where possible.
- Accessibility, performance and SEO requirements are satisfied.
- Build, lint, format and type checks all pass.
- Cloudflare Pages compatibility is preserved.