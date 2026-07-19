# Personal Technical Knowledge Platform

PTKP is a static-first technical knowledge platform built with Astro, TypeScript, Tailwind CSS, MDX, and Astro Content Collections.

## Stack

- Astro
- TypeScript
- Tailwind CSS
- MDX
- Astro Content Collections
- Cloudflare Pages

## Local Development

Requirements:

- Node.js 22.12 or newer
- npm 10 or newer

Commands:

```bash
npm install
npm run dev
```

Common validation commands:

```bash
npm run check
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run validate
```

## Environment

PTKP supports an optional public site URL override:

- `PUBLIC_SITE_URL`
- `SITE_URL`

If neither variable is set, the site falls back to `https://personal-tech-platform.pages.dev` for canonical URLs, sitemap generation, robots, RSS, and structured data.

## Deployment

Production hosting targets Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`

Reference documentation:

- [AGENTS.md](AGENTS.md)
- [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [docs/DEPLOYMENT_RUNBOOK.md](docs/DEPLOYMENT_RUNBOOK.md)

## Content and Architecture

PTKP is documentation-first. Content, metadata, and relationships are defined through Astro Content Collections and the documents under `docs/`.

Implementation work should follow:

1. `docs/PROJECT_SPEC.md`
2. `docs/PRINCIPLES.md`
3. `docs/ENGINEERING_STANDARDS.md`
4. `docs/DESIGN_SYSTEM.md`
5. `docs/COMPONENT_SPEC.md`
