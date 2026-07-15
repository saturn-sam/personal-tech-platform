
# PTKP Implementation Prompt

Milestone: 10

Name: Search

Status: Approved

---

# Purpose

Implement a fast, privacy-friendly, static-first search system for the Personal Technical Knowledge Platform (PTKP).

Search is the primary discovery mechanism of PTKP. It should help users locate knowledge quickly across all supported content types while preserving the platform's static architecture and Cloudflare Pages compatibility.

The implementation must avoid server-side dependencies and external search services.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/CONTENT_MODEL.md
- docs/INFORMATION_ARCHITECTURE.md
- docs/COMPONENT_SPEC.md
- docs/DESIGN_SYSTEM.md
- docs/CODING_STANDARDS.md
- docs/VOICE_AND_WRITING.md
- docs/ACCESSIBILITY.md
- docs/PERFORMANCE.md
- docs/SEO_GUIDE.md

These documents are authoritative.

---

# Objective

Implement a client-side search experience capable of indexing and searching all PTKP content while remaining lightweight, fast, and fully static.

The implementation should provide meaningful search results without sacrificing performance.

---

# Scope

Implement:

- Global search page
- Search input component
- Search results component
- Search result highlighting
- Keyboard navigation
- Empty state
- No results state
- Search loading state (if required)
- Search index generation during build
- Search utility functions
- Search filtering
- Search sorting
- Category filtering
- Breadcrumb display
- Related content links

Search must include:

- Articles
- Lab Notes
- Architecture Guides
- Projects
- Technologies
- Certifications
- Resources
- Learning Paths

---

# Requirements

The implementation must:

- Generate the search index at build time.
- Remain fully compatible with static hosting.
- Avoid external APIs.
- Avoid server-side rendering.
- Support fuzzy matching.
- Support partial matching.
- Support keyboard shortcuts (optional if defined in specifications).
- Support responsive layouts.
- Meet WCAG 2.2 AA requirements.

---

# Search Behavior

Search should prioritize:

1. Exact title matches
2. Keyword matches
3. Description matches
4. Tags
5. Technology names
6. Categories
7. Content body

Results should display:

- Title
- Content type
- Short description
- Breadcrumb
- Highlighted matching terms
- Estimated reading time (where applicable)

---

# Deliverables

Implement:

- Search page
- Search UI
- Search utilities
- Search index generator
- Search result rendering
- Result highlighting
- Filtering support
- Placeholder search index
- Shared search components

---

# Accessibility

Ensure:

- Semantic HTML
- Keyboard-only operation
- Screen reader announcements
- Visible focus indicators
- Accessible result navigation
- Accessible search input

---

# Performance

The implementation should:

- Generate the search index during build.
- Load search data lazily where appropriate.
- Minimize JavaScript.
- Avoid unnecessary hydration.
- Keep bundle size small.
- Maintain excellent Lighthouse performance.

---

# SEO

Implement:

- Search page metadata
- Canonical URL
- Structured heading hierarchy

Search results themselves should not create indexable URLs.

---

# Definition of Done

This milestone is considered complete only when:

- Search indexes all supported content collections.
- Search results are relevant and ordered correctly.
- Search remains fully static.
- Type checking, linting, formatting, and build all succeed.
- Accessibility requirements are satisfied.
- No known defects remain within the milestone scope.

---

# Validation

Before completing the task verify:

- npm run dev succeeds
- npm run build succeeds
- npm run check succeeds
- Linting passes
- Formatting passes
- Search index is generated successfully
- Search returns expected results
- Responsive layouts verified
- Keyboard navigation verified

---

# Out of Scope

Do not implement:

- AI-powered search
- Semantic search
- External search providers
- Elasticsearch
- Algolia
- Meilisearch
- User personalization
- Analytics
- Search history
- Authentication

---

# Expected Output

Provide:

1. Summary of implementation
2. Search architecture overview
3. Search index generation approach
4. Components created
5. Helper utilities created
6. Accessibility considerations
7. Performance considerations
8. Assumptions requiring approval

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

## Additional Implementation Instructions

1. The search implementation must remain fully static and compatible with Cloudflare Pages.

2. Do not use any external search service.

3. Generate the search index during the build process.

4. Search must operate entirely within the browser after the index is loaded.

5. Prefer a lightweight search library (such as Pagefind, MiniSearch, or a similarly lightweight static-search solution) that integrates well with Astro and does not require server infrastructure. Keep the integration abstract enough that the search engine could be replaced in the future if needed.

6. The search UI must reuse existing PTKP components and design tokens.

7. Do not duplicate metadata already available through Astro Content Collections.

8. Search results should clearly indicate the content type (Article, Project, Technology, Certification, Resource, etc.) to help users navigate the knowledge graph.