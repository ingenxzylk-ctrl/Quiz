# Hair & Scalp Health Assessment Quiz

A multi-step, gender-branching diagnostic quiz that collects user profile data, evaluates hair fall severity, internal health indicators, and scalp condition — then generates a personalized result summary with AI-powered scalp image analysis.

## Features

- **4-section conversational flow** with progress bar (Step 1–4 of 4)
- **Gender-based branching** for Hair Health (Section 2) and Internal Health (Section 3)
- **Image-based selection** for Norwood scale, hair volume, and hair pattern questions
- **Male path branching logic**: Stage 1 reassurance, Stages 2–3 location follow-up, Stages 4–7 skip location
- **Scalp photo capture** with upload/camera, guide overlay, good/bad photo examples, and consent screen
- **AI scalp analysis** with confidence scoring, mismatch detection, and low-confidence fallback
- **Content moderation** before AI processing (NSFW/inappropriate + non-scalp rejection)
- **Personalized results** with stage classification, contributing factors, and CTAs
- **Save & resume** via session ID and resume URL
- **Analytics tagging** on every question view/answer
- **Privacy notice** before internal health data collection

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Image capture**: react-webcam + native file input with `capture="environment"`
- **Backend**: Next.js API routes with in-memory session store (swap for DB in production)
- **AI**: Google Gemini Vision (`gemini-2.0-flash`) for scalp staging and image moderation

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your Gemini API key from https://aistudio.google.com/apikey
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for real AI) | Google AI Studio API key |
| `GEMINI_MODEL` | No | Model id (default: `gemini-2.0-flash`) |

Without `GEMINI_API_KEY`, the app falls back to heuristic mocks for local development.

Open [http://localhost:3000](http://localhost:3000) to start the assessment.

> **Use `npm run dev` for development** — not `npm start`. Production mode (`next start`) does not support HMR WebSockets and will show `webpack-hmr` connection errors in the console.

### Troubleshooting: HMR WebSocket errors

If you see `WebSocket connection to 'ws://127.0.0.1:3000/_next/webpack-hmr' failed`:

1. **Run the dev server** — `npm run dev` (not `npm start` after `npm run build`)
2. **Restart after config changes** — stop the server and run `npm run dev` again
3. **Cloud / port-forwarded IDE** — the dev script binds to `0.0.0.0` and `allowedDevOrigins` is preconfigured for Cursor and similar environments. Open the app using the forwarded URL shown in your IDE, not a stale tab
4. **Harmless in most cases** — this only affects hot reload; the app still works. Hard-refresh (`Ctrl+Shift+R`) if the page seems stuck

The `Unable to add filesystem: <illegal path>` message is a browser DevTools quirk, not an app bug.

## Quiz Architecture

```
START
 └─ Section 1: About Me (universal)
      └─ Gender selected → routes all subsequent sections
 └─ Section 2: Hair Health (Male / Female path)
 └─ Section 3: Internal Health (Male / Female path)
 └─ Section 4: Scalp Assessment (image upload/capture + AI) — MALE ONLY
 └─ RESULT: Personalized report (female path skips Section 4)
```

## Answer Schema

Every answer is tagged with:

```json
{
  "section": "hair_health",
  "question_id": "norwood_stage",
  "gender_path": "male",
  "value": "3"
}
```

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/quiz/save` | POST | Save quiz progress, returns resume URL |
| `/api/quiz/resume/[id]` | GET | Load saved quiz session |
| `/api/scalp/moderate` | POST | Content moderation check |
| `/api/scalp/analyze` | POST | AI scalp stage classification |

## Production Notes

- Replace in-memory `session-store` with encrypted database storage
- Gemini API key must be set in production (`GEMINI_API_KEY`)
- Integrate Twilio/WhatsApp Business API for OTP verification
- Add proper image storage (S3) instead of base64 in session state — pass URLs to Gemini for scale
