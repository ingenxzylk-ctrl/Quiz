# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 16 app (App Router, Turbopack) — the "Hair & Scalp Health Assessment Quiz". There is one service; no database, Docker, or external dependencies are required (sessions use an in-memory store in `src/lib/session-store.ts`, and AI/moderation are mocked).

Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`). Run the dev server with `npm run dev` (serves on http://localhost:3000; `/` is the landing page, `/quiz` is the assessment). API routes: `/api/quiz/save`, `/api/quiz/resume/[id]`, `/api/scalp/moderate`, `/api/scalp/analyze`.

Non-obvious caveats:
- `npm run lint` currently fails: the script runs bare `eslint`, but no `eslint.config.js`/`.eslintrc` exists in the repo (ESLint v9 requires flat config). This is a pre-existing repo issue, not an environment problem. Type checking still runs as part of `npm run build`.
- The SVG illustrations in `public/illustrations/` are already committed. `scripts/generate-svgs.js` only regenerates them if needed and is not part of the normal dev/build flow.
