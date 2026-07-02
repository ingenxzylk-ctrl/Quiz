# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 16 app (App Router, Turbopack) — the "Hair & Scalp Health Assessment Quiz". There is one service; no database or Docker is required (sessions use an in-memory store in `src/lib/session-store.ts`, moderation is mocked, and scalp AI uses Gemini when `GEMINI_API_KEY` is set — otherwise a deterministic mock).

Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`). Run the dev server with `npm run dev` (serves on http://localhost:3000; `/` is the landing page, `/quiz` is the assessment). API routes: `/api/quiz/save`, `/api/quiz/resume/[id]`, `/api/scalp/moderate`, `/api/scalp/analyze`.

Non-obvious caveats:
- `npm run lint` currently fails: the script runs bare `eslint`, but no `eslint.config.js`/`.eslintrc` exists in the repo (ESLint v9 requires flat config). This is a pre-existing repo issue, not an environment problem. Type checking still runs as part of `npm run build`.
- The SVG illustrations in `public/illustrations/` are already committed. `scripts/generate-svgs.js` only regenerates them if needed and is not part of the normal dev/build flow.
- Scalp stage detection (`src/lib/scalp-analysis.ts`, called from `/api/scalp/analyze`) uses the Gemini vision API when `GEMINI_API_KEY` is set (optional `GEMINI_MODEL`, default `gemini-2.5-flash`). Put the key in `.env.local` (git-ignored). Without a key it falls back to a deterministic mock classifier, so the quiz still runs end-to-end offline — check the server logs for `[ScalpAnalysis] Gemini analysis failed` to tell whether the real model or the fallback ran.
- The scalp scan (Section 4) is **male-only**. The female path finishes at Section 3 (Internal Health) and goes straight to results with no image capture/analysis, so `state.aiAnalysis` stays `null` for women (`reconcileStages` handles the null-AI case). `analyzeScalpImages` also only calls Gemini when `gender === "male"`.
