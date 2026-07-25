# PTKP Content Manager

Standalone Python utility for creating and maintaining PTKP MDX content without changing the Astro application architecture.

## Scope

The tool inspects the live repository before generating content:

- `src/content.config.ts`
- `src/lib/content/collections.ts`
- `src/lib/content/schema.ts`
- `src/lib/content/relationships.ts`
- existing `src/content/**/*.mdx`
- repository author metadata from `src/config/site.ts`

It derives:

- supported collections
- asset types
- route bases
- schema field order
- enum values
- placeholder image sources

The generator does not assume frontmatter fields outside the current repository schema.

## Dependencies

Install the approved Python dependencies:

```bash
python -m pip install rich questionary python-slugify PyYAML
```

The tool is designed for Python 3.13+.

## Run

From the repository root:

```bash
python tools/ptkp-content-manager/content.py
```

## Commands

- `New Content`
- `Publish Draft`
- `Update Modified Date`
- `Repository Health`
- `Validate Repository`
- `Exit`

## Implementation Notes

### Tool architecture

- `content.py`: interactive CLI entrypoint and transactional workflows
- `scanner.py`: repository inspection, collection discovery, schema parsing, content scanning
- `prompts.py`: Questionary-based prompts driven by discovered schemas
- `writer.py`: frontmatter generation, template rendering, file writes
- `template_engine.py`: placeholder renderer for `{{ variable }}`
- `validators.py`: schema-aware validation, duplicate detection, image checks, reference checks
- `publisher.py`: publish workflow
- `updater.py`: `updatedDate` workflow
- `doctor.py`: health and repository validation reporting
- `slug.py`: slug and filename generation
- `models.py`: typed data structures
- `config.py`, `constants.py`, `utils.py`: shared configuration and helpers

### Templates

Templates exist per asset type:

- `templates/article.md`
- `templates/lab-note.md`
- `templates/architecture-guide.md`
- `templates/case-study.md`
- `templates/project.md`
- `templates/technology.md`
- `templates/certification.md`
- `templates/resource.md`
- `templates/learning-path.md`

Each template is rendered through the local placeholder engine and backed by schema-derived frontmatter generation.

### Validation strategy

Before write:

- validate required schema fields
- validate enums, dates, URLs, numbers, arrays, and literals
- validate duplicate filename in target collection
- validate duplicate slug in target collection
- validate references and image paths where detectable

After write:

- re-scan repository
- run internal validation
- run `npm run check`
- run `npm run build`
- roll back the change automatically if validation fails

### Repository health

The health report includes:

- total content
- published / review / draft / archived counts
- featured count
- missing metadata
- duplicate slugs
- duplicate titles
- missing images
- broken related asset references
- broken internal content links where detectable

## Example generated content

Example article frontmatter shape:

```yaml
assetType: article
title: Example Article
slug: example-article
description: Short description under the SEO limit.
summary: Short description under the SEO limit.
author: Md. Samrat Uz Zaman
publishedDate: '2026-07-19'
updatedDate: '2026-07-19'
status: draft
tags:
  - Example
technologies:
  - Kubernetes
categories:
  - Containers
difficulty: intermediate
readingTime:
  minutes: 1
  text: 1 min read
relatedAssets: []
featuredImage:
  src: /assets/placeholders/article.svg
  alt: Example Article illustration
seo:
  title: Example Article
  description: Short description under the SEO limit.
  canonicalPath: /articles/example-article/
  robots: noindex,follow
featured: false
```

## Testing

Useful checks:

```bash
python -m compileall tools/ptkp-content-manager
python -m unittest discover tools/ptkp-content-manager/tests
npm run check
npm run build
```
