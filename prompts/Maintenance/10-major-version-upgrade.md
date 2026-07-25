# PTKP Maintenance Prompt

Task: Major Version Upgrade

Status: Approved

---

# Purpose

Perform a controlled major version upgrade of one or more core platform technologies while preserving the architecture, user experience, content integrity, performance, accessibility, and Cloudflare Pages compatibility of the Personal Technical Knowledge Platform (PTKP).

Major version upgrades include technologies such as Astro, Node.js, TypeScript, Vite, and other core build dependencies.

---

# Required Reading

Before making any changes, read and follow:

- AGENTS.md
- docs/PROJECT_SPEC.md
- docs/RELEASE_PROCESS.md
- docs/DEPLOYMENT_RUNBOOK.md
- docs/OPERATIONS_RUNBOOK.md
- docs/TROUBLESHOOTING.md
- docs/FUTURE_ENHANCEMENTS.md

These documents are authoritative.

---

# Objective

Upgrade one major platform component to its latest supported stable version while ensuring PTKP remains fully functional.

Only one major platform component should be upgraded during a single execution unless explicitly instructed otherwise.

---

# Upgrade Planning

Before implementation:

1. Review official release notes.
2. Review migration guides.
3. Identify deprecated APIs.
4. Identify breaking changes.
5. Evaluate dependency compatibility.
6. Produce an upgrade plan.

Do not begin implementation until the impact is understood.

---

# Upgrade Requirements

The implementation must:

- Preserve architecture.
- Preserve Information Architecture.
- Preserve Content Collections.
- Preserve routing.
- Preserve layouts.
- Preserve components.
- Preserve search.
- Preserve SEO.
- Preserve accessibility.
- Preserve Cloudflare Pages compatibility.

---

# Migration

Where required:

- Replace deprecated APIs.
- Update configuration files.
- Update build scripts.
- Update project documentation.
- Remove obsolete configuration.

Avoid introducing unnecessary refactoring.

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
- Responsive layouts

---

# Documentation

Update documentation affected by the upgrade, including:

- README
- RELEASE_PROCESS
- DEPLOYMENT_RUNBOOK
- OPERATIONS_RUNBOOK
- TROUBLESHOOTING

---

# Rollback Plan

Document:

- Previous versions
- Rollback procedure
- Recovery validation
- Known risks

Rollback must be possible without data loss.

---

# Deliverables

Provide:

1. Upgrade summary
2. Component upgraded
3. Version changes
4. Breaking changes encountered
5. Migration actions performed
6. Validation results
7. Rollback procedure
8. Remaining follow-up work

---

# Out of Scope

Do not:

- Add new features
- Redesign the UI
- Modify content unnecessarily
- Change Information Architecture
- Introduce unrelated refactoring

---

# Expected Output

Produce a complete major version upgrade report including planning, implementation summary, validation, documentation updates, rollback guidance, and any required follow-up actions.