# PTKP Implementation Prompt

Milestone: 13

Name: Advanced Search

Status: Approved

---

# Purpose

Enhance the existing search experience of the Personal Technical Knowledge Platform (PTKP) while preserving the current architecture, design system, and static-first approach.

This milestone improves discoverability and usability only.

No redesign is permitted.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/INFORMATION_ARCHITECTURE.md
- docs/CONTENT_MODEL.md
- docs/COMPONENT_SPEC.md
- docs/DESIGN_SYSTEM.md
- docs/PERFORMANCE.md
- docs/ACCESSIBILITY.md
- docs/CODING_STANDARDS.md

These documents are authoritative.

---

# Objective

Implement an advanced client-side search experience that scales efficiently as PTKP grows.

The implementation must remain fully static and compatible with Cloudflare Pages.

---

# Scope

Improve the existing search with the following capabilities:

- Fast full-text search
- Search across all content collections
- Instant search results
- Keyboard shortcut
- Search dialog
- Result grouping
- Search snippets
- Search term highlighting
- Empty-state handling
- Recent searches
- Clear search action
- Accessible search experience

---

# Content Sources

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

# Search Dialog

Implement a searchable modal dialog.

Requirements:

- Opens from Search button
- Opens with Ctrl+K
- Opens with Cmd+K (macOS)
- Escape closes dialog
- Click outside closes dialog
- Keyboard navigation
- Focus trap
- Responsive layout

---

# Search Results

Display:

- Title
- Collection
- Description
- Highlighted matching terms
- URL

Group results by collection.

Example:

Articles

Technologies

Projects

Certifications

Resources

Learning Paths

---

# Search Ranking

Prioritize matches in this order:

1. Title
2. Tags
3. Description
4. Headings
5. Body content

Exact matches should appear before partial matches.

---

# Search Snippets

Display a short excerpt surrounding the matched terms.

Highlight the matching text.

Limit snippet length for readability.

---

# Recent Searches

Store recent searches locally.

Requirements:

- Maximum 10 entries
- Local storage only
- No analytics
- No server interaction

Allow users to:

- Reuse previous searches
- Clear search history

---

# Keyboard Navigation

Support:

- Ctrl+K / Cmd+K
- Arrow keys
- Enter to open result
- Escape to close
- Tab navigation

---

# Empty State

When no results exist display:

- Clear message
- Search suggestions
- Link back to homepage

---

# Accessibility

Support:

- ARIA roles
- Screen reader labels
- Keyboard-only navigation
- Focus management
- WCAG 2.2 AA

---

# Performance

Requirements:

- Static search index
- Lazy-load search index
- Lazy-load search dialog
- Minimal JavaScript
- Fast initial page load

Avoid loading the search index until needed.

---

# Design Requirements

Reuse:

- Existing typography
- Existing spacing
- Existing color palette
- Existing components
- Existing design tokens

Search must integrate naturally into the existing UI.

Do not redesign the platform.

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

- Search dialog
- Keyboard shortcuts
- Search ranking
- Highlighting
- Result grouping
- Recent searches
- Empty state
- Responsive layouts
- Accessibility

---

# Deliverables

Provide:

1. Components created
2. Components updated
3. Search architecture
4. Search indexing strategy
5. Accessibility summary
6. Performance considerations
7. Validation results

---

# Out of Scope

Do not implement:

- AI search
- Semantic search
- Server-side search
- Authentication
- Analytics
- User accounts
- Content generation
- Design redesign

---

# Additional Implementation Instructions

1. Use Astro components wherever possible.

2. Keep JavaScript minimal.

3. Lazy-load all search-related assets.

4. Maintain Cloudflare Pages compatibility.

5. Ensure search works across all Content Collections.

6. Keep the implementation scalable for thousands of documents.

7. Reuse the existing component library.

8. Preserve the current visual identity.

9. Do not modify existing content.

10. Do not introduce unnecessary dependencies.

---

# Definition of Done

This milestone is complete only when:

- Search is significantly more usable than the baseline implementation.
- Keyboard shortcuts function correctly.
- Search results are grouped and ranked appropriately.
- Recent searches work locally.
- Build, lint, formatting, and type checks pass.
- Lighthouse performance remains excellent.
- Cloudflare Pages compatibility is preserved.
- No regressions are introduced.