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
- **AI**: Google Gemini vision model (`gemini-2.5-flash`) for scalp stage detection, with a deterministic mock fallback when no API key is configured

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start the assessment.

## Environment Variables

Scalp stage detection uses Google's Gemini vision model when an API key is
configured. Create a `.env.local` file in the project root:

```bash
# Required for real AI scalp analysis (get one at https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_api_key_here

# Optional — override the default vision model (defaults to gemini-2.5-flash)
GEMINI_MODEL=gemini-2.5-flash
```

If `GEMINI_API_KEY` is **not** set, the app automatically falls back to a
deterministic mock classifier so the flow still works end-to-end during local
development. The key is only used server-side (in the `/api/scalp/analyze`
route) and is never exposed to the browser.

## Quiz Architecture

```
START
 └─ Section 1: About Me (universal)
      └─ Gender selected → routes all subsequent sections
 └─ Section 2: Hair Health (Male / Female path)
 └─ Section 3: Internal Health (Male / Female path)
 └─ Section 4: Scalp Assessment (image upload/capture + AI)
 └─ RESULT: Personalized report
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
- `scalp-analysis` uses Gemini vision when `GEMINI_API_KEY` is set; swap the mock `moderation` module with a hosted safety/vision API
- Integrate Twilio/WhatsApp Business API for OTP verification
- Add proper image storage (S3) instead of base64 in session state
