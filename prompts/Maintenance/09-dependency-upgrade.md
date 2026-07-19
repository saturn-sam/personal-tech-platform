# PTKP Maintenance Prompt

Task: Dependency Upgrade

Status: Approved

---

# Purpose

Safely upgrade project dependencies while preserving the architecture, functionality, design consistency, performance, accessibility, and Cloudflare Pages compatibility of the Personal Technical Knowledge Platform (PTKP).

Dependency upgrades must minimize risk and avoid introducing breaking changes.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/RELEASE_PROCESS.md
- docs/DEPLOYMENT_RUNBOOK.md
- docs/OPERATIONS_RUNBOOK.md
- docs/TROUBLESHOOTING.md

These documents are authoritative.

---

# Objective

Upgrade project dependencies to supported stable versions while maintaining platform stability.

---

# Upgrade Scope

Review:

- Astro
- Node.js compatibility
- npm dependencies
- TypeScript
- ESLint
- Prettier
- Markdown tooling
- Search dependencies
- Build tooling

---

# Upgrade Strategy

Follow this order:

1. Review release notes.
2. Identify breaking changes.
3. Upgrade one dependency group at a time.
4. Resolve compatibility issues.
5. Validate the build.
6. Validate the application.
7. Document changes.

Avoid bulk upgrades whenever possible.

---

# Requirements

The implementation must:

- Preserve architecture.
- Preserve layouts.
- Preserve components.
- Preserve routing.
- Preserve search.
- Preserve accessibility.
- Preserve SEO.
- Preserve Cloudflare Pages compatibility.

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

- Homepage
- Articles
- Projects
- Technologies
- Certifications
- Resources
- Search
- Navigation

---

# Documentation

Update documentation when:

- Upgrade introduces breaking changes.
- Build process changes.
- Deployment process changes.
- Configuration changes.

---

# Deliverables

Provide:

1. Dependencies upgraded
2. Version changes
3. Breaking changes identified
4. Compatibility notes
5. Validation results
6. Rollback considerations

---

# Out of Scope

Do not:

- Add new features
- Refactor unrelated code
- Change architecture
- Change layouts
- Change navigation

---

# Expected Output

Produce a dependency upgrade report including validation results and any required follow-up actions.