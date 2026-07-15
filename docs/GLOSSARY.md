# Glossary

Version: 1.0

Status: Active

---

# Purpose

This glossary defines the official terminology used throughout the Personal Technical Knowledge Platform (PTKP).

Its objectives are to:

- Establish a consistent vocabulary.
- Eliminate ambiguity.
- Improve documentation quality.
- Standardize UI labels.
- Provide a shared language for contributors and AI agents.

Whenever terminology conflicts occur, the definitions in this document take precedence.

---

# General Terms

## PTKP

**Personal Technical Knowledge Platform**

The complete digital platform that stores, organizes, and presents engineering knowledge, projects, documentation, and professional experience.

PTKP is the product.

The website is the user interface.

---

## Knowledge

Engineering information that has long-term value.

Knowledge includes documentation, architecture, implementation experience, troubleshooting guidance, and lessons learned.

Knowledge is the primary asset of PTKP.

---

## Knowledge Asset

A first-class content entity within PTKP.

Every published item is a Knowledge Asset.

Examples:

- Article
- Project
- Architecture Guide
- Lab Note
- Learning Path
- Certification
- Resource
- Technology Page

Knowledge Assets have:

- Metadata
- Relationships
- Categories
- Tags
- URLs
- Search indexing

---

# Content Types

## Article

Long-form evergreen technical documentation.

Articles explain concepts, technologies, implementations, or best practices.

Articles are maintained over time.

They are not chronological blog posts.

---

## Lab Note

A concise technical reference that documents a single task or solution.

Characteristics:

- Short
- Practical
- Searchable
- Focused on one topic

---

## Architecture Guide

A comprehensive document describing the design of a technical solution.

Typically includes:

- Context
- Requirements
- Constraints
- Architecture
- Components
- Security
- Networking
- Operations
- Lessons Learned

---

## Project

Documentation describing a real engineering implementation.

Projects focus on:

- Business objectives
- Technical decisions
- Implementation
- Outcomes
- Lessons learned

Projects are implementation-focused rather than résumé-oriented.

---

## Technology Page

A hub page dedicated to a specific technology.

It aggregates all related Knowledge Assets.

Example:

Kubernetes

may include:

- Articles
- Projects
- Architecture Guides
- Lab Notes
- Certifications
- Resources

Technology Pages organize knowledge.

They do not duplicate it.

---

## Learning Path

A curated sequence of Knowledge Assets designed to help readers learn a topic progressively.

Learning Paths reference existing documentation rather than duplicating content.

---

## Certification

Documentation describing a professional certification.

Contains:

- Credential information
- Related technologies
- Related projects
- Study resources
- Verification details

---

## Resource

Supporting material associated with Knowledge Assets.

Examples:

- Cheat Sheets
- Scripts
- Templates
- Downloads
- Configuration examples

---

## Download

A downloadable file published through PTKP.

Examples:

- PDF
- PowerPoint
- Spreadsheet
- Script
- Configuration file

Downloads should always relate to another Knowledge Asset.

---

## Case Study

Documentation explaining a significant engineering decision or implementation.

Focuses on:

- Context
- Constraints
- Trade-offs
- Outcome

---

# Organizational Terms

## Category

A broad organizational grouping.

Examples:

- Kubernetes
- Cloud
- Virtualization
- Networking
- Security

Each Knowledge Asset belongs to at least one category.

---

## Tag

A descriptive keyword used for filtering and search.

Tags provide flexible classification.

Examples:

- VKS
- NSX
- Terraform
- GitOps
- Linux

---

## Topic

A conceptual subject that may span multiple categories.

Example:

"Disaster Recovery"

may relate to:

- VMware
- Kubernetes
- Storage
- Backup

---

## Series

A collection of related Knowledge Assets intended to be read together.

Series should define a logical progression.

---

# Navigation Terms

## Primary Navigation

The main navigation visible throughout PTKP.

It provides access to the platform's major sections.

---

## Breadcrumb

A navigation aid showing the current location within the information hierarchy.

---

## Related Knowledge

Automatically or manually linked Knowledge Assets that provide additional context.

Relationships improve discoverability and learning.

---

# Engineering Terms

## Static Site Generation (SSG)

The process of generating HTML during the build rather than at request time.

PTKP is a static-first platform.

---

## Content Collection

A structured collection of Knowledge Assets managed by Astro.

Content Collections enforce metadata validation and type safety.

---

## Frontmatter

Structured metadata placed at the beginning of Markdown or MDX documents.

Frontmatter defines attributes such as:

- Title
- Description
- Tags
- Technologies
- Published Date

---

## Mermaid

A text-based diagram language used to create version-controlled technical diagrams.

Preferred over embedded images whenever practical.

---

## Progressive Enhancement

A design approach where the core experience works without advanced browser features, while additional functionality enhances capable environments.

---

# Editorial Terms

## Evergreen Documentation

Documentation intended to remain valuable through regular updates.

Evergreen documentation is preferred over time-sensitive content.

---

## Technical Accuracy

The requirement that all published material be factually correct, reproducible where practical, and aligned with official documentation or validated experience.

---

## Practical Value

The degree to which content helps readers solve real engineering problems.

Practical value is prioritized over theoretical discussion.

---

# Governance Terms

## Principle

A long-term rule that guides decisions.

Principles change rarely.

---

## Standard

A mandatory engineering or editorial requirement.

Standards define expected behavior.

---

## Guideline

A recommended practice.

Guidelines provide flexibility while encouraging consistency.

---

## Specification

A detailed description of expected behavior or implementation.

Specifications are authoritative.

---

# Final Notes

Terminology should remain consistent throughout PTKP.

Do not introduce new terms when an existing defined term already communicates the intended meaning.

When a new concept requires new terminology, update this glossary before using the term elsewhere.