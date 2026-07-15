# PTKP Implementation Prompt

Milestone: 1

Name: Project Foundation

Status: Approved

---

# Purpose

Implement the technical foundation of the Personal Technical Knowledge Platform (PTKP).

This milestone establishes the project bootstrap, development tooling, quality gates, and directory structure.

No application features should be implemented.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/INFORMATION_ARCHITECTURE.md
- docs/CONTENT_MODEL.md
- docs/DESIGN_SYSTEM.md
- docs/ENGINEERING_STANDARDS.md
- docs/PRINCIPLES.md
- docs/VOICE_AND_WRITING.md
- docs/TECH_STACK.md
- docs/GLOSSARY.md
- docs/COMPONENT_SPEC.md
- docs/CODING_STANDARDS.md
- docs/ROADMAP.md
- docs/DEPLOYMENT.md
- docs/PERFORMANCE.md
- docs/SEO_GUIDE.md
- docs/ACCESSIBILITY.md

These documents define the project architecture and must take precedence over implementation preferences.

---

# Objective

Bootstrap a production-ready Astro project configured according to the project specifications.

The result should be a clean, maintainable repository ready for future implementation milestones.

---

# Scope

Implement only the project foundation.

Included:

- Astro project initialization
- TypeScript (strict mode)
- Tailwind CSS
- MDX support
- Astro Content Collections
- Shiki syntax highlighting
- Mermaid integration (configuration only)
- ESLint
- Prettier
- Husky
- lint-staged
- GitHub Actions
- Cloudflare Pages compatibility
- Path aliases
- Project scripts
- Base directory structure
- Placeholder files where appropriate

Do not implement pages, layouts, components, styling, or business logic.

---

# Deliverables

Create and configure:

- package.json
- astro.config.mjs
- tsconfig.json
- tailwind.config.*
- postcss.config.*
- eslint configuration
- prettier configuration
- .editorconfig
- .gitignore
- Husky hooks
- lint-staged configuration
- GitHub Actions workflow(s)

Create the project directory structure defined by the specifications.

Provide placeholder files where empty directories would otherwise be omitted.

---

# Implementation Requirements

Requirements include:

- Enable strict TypeScript.
- Configure MDX.
- Configure Content Collections.
- Configure syntax highlighting.
- Configure Mermaid support.
- Configure import aliases.
- Configure development scripts.
- Configure build scripts.
- Configure linting.
- Configure formatting.
- Configure type checking.

Use current stable versions of dependencies unless the specifications require otherwise.

---

# Validation

Before completing the task, verify:

- Dependency installation succeeds.
- Development server starts successfully.
- Production build succeeds.
- Type checking passes.
- Linting passes.
- Formatting passes.

No warnings or errors should remain unresolved.

---

# Out of Scope

Do not implement:

- Homepage
- Navigation
- Components
- Layouts
- Search
- Content rendering
- Theme switching
- SEO metadata
- Styling beyond the minimum required configuration
- Sample content

If uncertain whether something belongs in Milestone 1, exclude it.

---

# Expected Output

Provide:

1. Summary of completed work.
2. Directory tree.
3. List of created files.
4. List of configured tools.
5. Any assumptions requiring approval.
6. Recommended next milestone.

Do not continue beyond this milestone.

---

# Definition of Done

This milestone is considered complete only when:

- All required deliverables are implemented.
- The implementation complies with the project specifications.
- No placeholder UI components are introduced outside the defined scope.
- Type checking, linting, formatting, and build all succeed.
- Accessibility requirements are satisfied.
- No known defects remain within the milestone scope.