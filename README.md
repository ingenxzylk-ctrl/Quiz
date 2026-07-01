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
- **AI**: Mock CNN classifier with structured output (ready to swap for hosted vision API)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start the assessment.

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
- Swap mock `scalp-analysis` and `moderation` modules with hosted vision APIs
- Integrate Twilio/WhatsApp Business API for OTP verification
- Add proper image storage (S3) instead of base64 in session state
