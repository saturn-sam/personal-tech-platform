# Contributing

## Workflow

1. Read `AGENTS.md` and the relevant documents in `docs/`.
2. Keep each change scoped to one logical concern.
3. Preserve the static-first Astro architecture.
4. Avoid undocumented features, dependencies, and structural changes.

## Validation

Run the full quality gate set before opening a change for review:

```bash
npm run validate
```

At minimum, local changes should leave these passing:

- `npm run check`
- `npm run typecheck`
- `npm run lint`
- `npm run format:check`
- `npm run build`

## Commits

- Use Conventional Commits.
- Keep commits focused.
- Do not mix unrelated refactors with feature or content changes.

## Content and Documentation

- Content must validate against Astro Content Collection schemas.
- Do not bypass schema validation.
- Update documentation when implementation changes documented behavior.
- Preserve accessibility and performance requirements for every change.

## Deployment Notes

Cloudflare Pages is the production hosting target.

Repository automation expects:

- CI validation on pushes and pull requests
- Cloudflare Pages deployment wiring through GitHub Actions secrets for production deploys

Required deployment secrets for the Pages workflow:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
