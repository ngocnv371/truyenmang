# AGENTS.md — strapi-launchpad

## Repo structure

```
├── next/          # Next.js 16 frontend (React 19, App Router, i18n en/vi)
├── strapi/        # Strapi 5.47.1 CMS backend (SQLite)
└── scripts/       # Shared: copy-env.mts (.env setup with secret generation)
```

Yarn 4.5.0 workspaces across three packages. `nodeLinker: node-modules`.

## Setup & dev commands

```bash
# Full setup (install deps + generate .env for both apps)
yarn setup

# Start both services (Strapi first, Next.js waits on port 1337)
yarn dev

# Run a single app in isolation
yarn next          # Next.js only
yarn strapi        # Strapi only
```

**Important:** `setup:next` and `setup:strapi` run `scripts/copy-env.mts`, which copies `.env.example` → `.env` and replaces placeholders with generated UUIDs. If `.env` already exists, the script skips — so after a fresh clone or `.env` deletion you must re-run setup.

## Seed data

```bash
# Import seed data into Strapi (must be running)
yarn seed

# Export current Strapi data back to ./data/
yarn export
```

Seed file: `strapi/data/export_20250116105447.tar.gz`

## Code quality

- **Formatter:** Prettier (single quotes, semicolons, tabWidth 2, LF). Plugin: `@trivago/prettier-plugin-sort-imports` with import order grouping.
- **Pre-commit hook:** Husky → lint-staged → runs `prettier --write` on staged files + `next lint --fix` on Next.js TS/JS files.
- No ESLint rules beyond `next/core-web-vitals`.

```bash
yarn check:format   # verify formatting
yarn fix            # reformat everything
```

## Architecture notes

### Frontend (next/)
- **Strapi client:** `@strapi/client` v1.6.0, used via `next/lib/strapi/index.ts`. Entry point for all CMS fetches (`fetchCollectionType`, etc.).
- **Pages:** Internationalized under `app/[locale]/(marketing)/`. Homepage filters pages by `{ slug: 'homepage', locale }`.
- **Book/chapter routes:** `books/[slug]/` (book detail) and `books/[slug]/[chapterSlug]/` (reading page).
- **Draft mode preview:** API routes at `/api/preview` and `/api/exit-preview`. Preview secret is generated during setup.
- **Remote images:** Next.js config allows `localhost:1337/uploads`, `${IMAGE_HOSTNAME}/uploads`, and `*.strapiapp.com`. Image optimization disabled in dev (`unoptimized: true`).
- **Build-time redirects:** Fetches from Strapi `/api/redirections` at build time. Requires `NEXT_PUBLIC_API_URL`.

### Backend (strapi/)
- **Content types:** book, chapter, article, page, product, blog-page, books-page, category, genre, faq, global, plan, redirection, testimonial, logo, book-comment, chapter-comment, product-page. Each has controller/service/route/middleware in `src/api/`.
- **Components:** Organized under `src/components/` — shared (seo, link, button), dynamic-zone (hero, features, testimonials, etc.), items, global (navbar, footer).
- **Admin customization:** Custom admin app at `strapi/src/admin/app.tsx`.
- **Post-install hook:** `scripts/updateUuid.js` runs after `yarn install`.

### i18n
Two locales: `en` (default) and `vi`. Config in `next/i18n.config.ts`. Pages use `[locale]` route group.

## Gotchas

- **No test framework.** There are no Jest/Vitest configs or test scripts.
- **Strapi must be running before Next.js** — the root `dev` script uses `wait-on http://localhost:1337` to enforce this. Starting them separately requires manual ordering.
- **`.env` files are gitignored.** After deleting `.env`, re-run `yarn setup:<app>` to regenerate. The copy-env script will not overwrite existing `.env` files.
- **Strapi TS config** (`strapi/tsconfig.json`) has `strict: false` and excludes `src/admin/`. Admin code uses its own tsconfig.
- **CI** (`deploy-demo.yaml`) only triggers an external GitLab pipeline — no local build/test in CI.
