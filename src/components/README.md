# Component Library

Reusable UI components for PTKP live in this directory.

Components are presentation-focused, typed Astro components. They should not fetch content, own business logic, or decide public routes. Pages and feature components should compose these primitives instead of duplicating layout, metadata, or interaction patterns.

## Categories

- `ui/` contains small visual primitives such as buttons, links, cards, badges, tags, chips, avatars, icons, and dividers.
- `layout/` contains reusable layout primitives such as containers, sections, grids, and stacks.
- `navigation/` contains reusable navigation primitives such as breadcrumbs and pagination.
- `documentation/` contains technical documentation wrappers for callouts, code blocks, Mermaid diagrams, and data tables.
- `feedback/` contains empty, error, and loading states.
- `utility/` contains browser-enhanced utilities such as theme selection and copy-to-clipboard.

Interactive components should use the smallest possible browser script and must preserve semantic HTML, keyboard access, and visible focus states.
