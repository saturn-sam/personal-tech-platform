# PTKP Implementation Prompt

Milestone: 21 (Post-v1 Utility)

Name: PTKP Content Manager

Status: Approved

---

# Purpose

Implement a standalone Python-based PTKP Content Manager that automates the creation and maintenance of content for the Personal Technical Knowledge Platform.

The Content Manager is a developer productivity tool only.

It is NOT part of the Astro website.

It must integrate with the existing repository without requiring changes to the website architecture.

---

# Critical Requirement

Do NOT make assumptions about the content model.

The repository already contains Astro Content Collections and Zod schemas.

The implementation MUST inspect the existing repository and generate content that exactly matches the current schemas.

Do not invent fields.

Do not remove required fields.

Do not simplify the schema.

The generated MDX files must pass:

```bash
npm run check
npm run build
```

without any schema validation errors.

---

# Repository Analysis

Before implementing anything, inspect and understand:

- src/content.config.ts (or src/content/config.ts)
- src/lib/content/
- src/lib/content/schema.ts (or equivalent)
- Every Zod schema
- Existing MDX files
- Existing frontmatter
- Existing content collections
- Existing templates
- Existing naming conventions

The implementation must follow the repository exactly.

---

# Tool Location

Create:

tools/

    ptkp-content-manager/

        content.py

        writer.py

        template_engine.py

        validators.py

        scanner.py

        publisher.py

        updater.py

        doctor.py

        slug.py

        prompts.py

        config.py

        constants.py

        models.py

        utils.py

        templates/

        README.md

The website must not import this tool.

---

# Supported Content Types

The tool must support every existing collection automatically.

At minimum:

- Articles
- Lab Notes
- Architecture Guides
- Projects
- Technologies
- Certifications
- Resources
- Learning Paths

These must be derived from the repository configuration, not hardcoded where practical.

---

# Template Generation

Do NOT create generic templates.

Instead:

1. Inspect the repository schema.
2. Build templates matching the schema.
3. Every generated file must satisfy the corresponding Zod schema.

Template placeholders should use:

{{ title }}

{{ description }}

{{ slug }}

etc.

Avoid fragile string replacement.

---

# Placeholder Engine

Implement a reusable placeholder renderer.

Support:

{{ variable }}

throughout every template.

Avoid external template engines unless already present in the project.

---

# Interactive CLI

The tool must provide an interactive terminal interface using Rich and Questionary.

Menu:

- New Content
- Publish Draft
- Update Modified Date
- Repository Health
- Validate Repository
- Exit

---

# New Content Workflow

Ask for:

- Content Type
- Title
- Description
- Difficulty (if applicable)
- Tags
- Categories (if required)
- Featured
- Draft

Automatically generate:

- slug
- filename
- dates
- frontmatter
- markdown body

using the correct schema.

---

# Validation

Validate before writing:

- duplicate slug
- duplicate filename
- required metadata
- schema-specific fields
- invalid dates
- invalid values

---

# Repository Health

Generate a report including:

- Total content
- Published
- Draft
- Featured
- Missing metadata
- Duplicate slugs
- Duplicate titles
- Missing images
- Broken internal references (where detectable)

---

# Publish Workflow

Allow selecting a draft.

Automatically update:

- status
- publishedDate
- updatedDate

according to the repository schema.

---

# Update Workflow

Allow updating:

- updatedDate

without modifying other metadata.

---

# Code Quality

Follow the existing project coding standards.

Keep modules focused.

Avoid large files.

Use type hints throughout.

Document public functions.

---

# Dependencies

Prefer only:

- rich
- questionary
- python-slugify
- PyYAML

Do not introduce additional dependencies unless clearly justified.

---

# Compatibility

The implementation must remain compatible with:

- Python 3.13+
- Astro
- Cloudflare Pages
- Existing project architecture

No changes should be required to the Astro application.

---

# Testing

Verify:

- New Article
- New Project
- New Technology
- New Certification
- New Resource
- New Learning Path
- New Lab Note
- New Architecture Guide

Every generated file must pass the repository schema validation.

---

# Deliverables

Provide:

1. Tool architecture
2. Commands implemented
3. Templates created
4. Validation strategy
5. Repository health features
6. Testing summary
7. Example generated content

---

# Definition of Done

The implementation is complete only when:

- The tool generates valid MDX for every content type.
- Every generated file passes Astro content schema validation.
- The website builds successfully.
- No existing content is broken.
- The tool is documented.
- The implementation is maintainable and extensible.