# Architecture Overview

## Runtime Model

PTKP is implemented as a static-first Astro application. Content is authored as Markdown or MDX and compiled into static routes at build time.

## Key Layers

- Content layer: Astro content collections backed by schema validation
- Presentation layer: Astro pages and shared layout components
- Styling layer: Tailwind CSS and a shared global stylesheet
- Search layer: client-side search powered by a generated JSON index
- Deployment layer: static output suitable for Cloudflare Pages

## Production Considerations

The architecture prioritizes:

- Static generation for fast delivery
- Minimal client-side JavaScript
- Accessible and semantic HTML
- Searchable content and sitemap generation
- Long-term maintainability
