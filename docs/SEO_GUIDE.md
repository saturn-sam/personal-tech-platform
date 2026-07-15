# SEO Guide

Version: 1.0

Status: Active

---

# Purpose

This document defines the Search Engine Optimization (SEO) strategy for the Personal Technical Knowledge Platform (PTKP).

The objective is to maximize discoverability while maintaining technical accuracy, content quality, and an excellent user experience.

SEO should support readers—not manipulate search engines.

---

# SEO Principles

PTKP follows these principles:

- Content-first
- Human-first writing
- Evergreen documentation
- Semantic HTML
- Strong information architecture
- Internal knowledge linking
- Fast page performance

---

# Primary Objectives

Version 1.0 aims to:

- Ensure all public Knowledge Assets are indexable.
- Improve discoverability through high-quality documentation.
- Maintain a clear and logical site structure.
- Generate rich previews for social platforms.
- Support long-term search visibility.

---

# URL Strategy

URLs should be:

- Short
- Descriptive
- Stable
- Human-readable

Examples:

/articles/kubernetes-network-policies/

/projects/vmware-vcf-datacenter/

/technologies/kubernetes/

/certifications/aws-solutions-architect-associate/

Avoid:

- Numeric IDs
- Dates in URLs
- Version numbers
- Query parameters for permanent content

URLs should remain stable whenever practical.

---

# Metadata Requirements

Every public page must define:

- Title
- Description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Twitter Card metadata
- Robots directives

Metadata should accurately describe the page.

---

# Title Guidelines

Titles should:

- Clearly describe the topic.
- Use natural language.
- Avoid clickbait.
- Avoid unnecessary prefixes.

Examples:

Good:

Kubernetes Network Policies Explained

Avoid:

You Won't Believe These Kubernetes Secrets

---

# Description Guidelines

Descriptions should:

- Summarize the page.
- Remain under approximately 160 characters.
- Encourage informed clicks.
- Avoid keyword repetition.

---

# Canonical URLs

Every public page must define a canonical URL.

Canonical URLs prevent duplicate indexing and establish the preferred page.

---

# Open Graph

Every page should provide:

- Title
- Description
- Image
- URL
- Site Name

This ensures consistent previews when content is shared.

---

# Twitter Cards

Use summary_large_image where appropriate.

Maintain consistency with Open Graph metadata.

---

# Sitemap

Generate a sitemap automatically during every production build.

Include:

- Articles
- Projects
- Technology Pages
- Architecture Guides
- Certifications
- Resources
- Learning Paths

Exclude:

- Drafts
- Private content
- Development pages

---

# Robots.txt

Provide a robots.txt file.

Allow indexing of public content.

Block unnecessary build artifacts or private paths.

---

# Structured Data

Use Schema.org structured data where appropriate.

Examples:

- Article
- TechArticle
- Person
- BreadcrumbList
- WebSite

Structured data should accurately represent page content.

---

# Internal Linking

Internal linking is essential.

Every Knowledge Asset should reference related assets whenever appropriate.

Examples:

An Article may link to:

- Related Projects
- Architecture Guides
- Technology Pages
- Lab Notes
- Resources

Internal links improve navigation and knowledge discovery.

---

# Heading Structure

Use a logical heading hierarchy.

Requirements:

- One H1 per page.
- Sequential heading levels.
- Avoid skipping levels unnecessarily.

Headings should describe content rather than act as styling elements.

---

# Images

Images should:

- Include descriptive alt text.
- Be optimized.
- Support the surrounding content.

Decorative images should be minimized.

---

# Content Quality

Search visibility should result from:

- Technical accuracy
- Original content
- Practical experience
- Clear explanations
- Regular updates

Avoid creating content solely to target keywords.

---

# Duplicate Content

Avoid publishing multiple pages that cover the same topic unnecessarily.

When expanding a subject:

- Update the existing Knowledge Asset.
- Cross-reference related material.
- Consolidate overlapping information.

---

# Evergreen Content

Prioritize documentation that remains useful over time.

Review older content periodically and update it when technology evolves.

---

# Performance

SEO depends on performance.

Maintain:

- Fast loading
- Mobile responsiveness
- Minimal layout shift
- Efficient asset delivery

Performance targets are defined in PERFORMANCE.md.

---

# Accessibility

Accessibility contributes to discoverability.

Maintain:

- Semantic HTML
- Meaningful headings
- Descriptive links
- Keyboard accessibility

Accessibility requirements are defined in ACCESSIBILITY.md.

---

# Mobile Optimization

Every page must function well on:

- Phones
- Tablets
- Desktop browsers

Mobile usability is mandatory.

---

# Search Indexing

Search engines should easily discover:

- Public Knowledge Assets
- Technology Pages
- Projects
- Articles

Drafts should remain unindexed.

---

# RSS

Future versions should publish an RSS feed containing:

- New Articles
- Lab Notes
- Architecture Guides

RSS should complement—not replace—the website.

---

# Link Quality

External links should:

- Reference authoritative sources.
- Remain relevant.
- Be reviewed periodically.

Broken external links should be corrected when discovered.

---

# Content Maintenance

Review published content periodically to:

- Update outdated information.
- Replace obsolete references.
- Improve explanations.
- Refresh metadata when appropriate.

Content maintenance is part of the publication lifecycle.

---

# SEO Validation Checklist

Before publishing verify:

- Title present
- Description present
- Canonical URL defined
- Open Graph metadata complete
- Structured data valid
- Heading hierarchy correct
- Internal links functional
- Images optimized
- Alt text present
- Sitemap updated
- No broken links

---

# Final Principle

Search engines should discover PTKP because it provides exceptional technical documentation—not because it attempts to manipulate ranking algorithms.

High-quality knowledge remains the strongest long-term SEO strategy.