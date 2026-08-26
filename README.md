# VedaAI — Question Paper & Handwritten Answer Mapping

A web app that lets a teacher upload a question paper and a handwritten
student answer sheet, then automatically extracts the questions, extracts
the handwritten answers, maps each answer to its matching question, and
highlights exactly where each answer appears on the original scanned page.

Built as a take-home assignment for VedaAI.

## What it does

1. **Upload** a question paper and an answer sheet (PDF or image, up to 10MB each).
2. **Extract** — Gemini reads the question paper and pulls out every question
   with its label, text, and order. Separately, it reads the answer sheet and
   pulls out every answer block along with its detected label (if any) and
   its bounding region on the page.
3. **Map** — each extracted answer is matched to its question by label
   (e.g. an answer marked `"2)"` is matched to question `"2"`). Answers with
   no matching label, or questions with no matching answer, are flagged
   rather than silently dropped.
4. **Review** — a two-panel screen shows the extracted questions on one side
   and the original answer sheet on the other. Selecting a question jumps
   the answer sheet to the right page and highlights the exact region the
   answer was found in.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Icons | lucide-react |
| State | Zustand |
| Animation | Framer Motion |
| PDF rendering | react-pdf / pdfjs-dist |
| AI extraction | Google Gemini API (`@google/genai`) |
| Validation | Zod |
| Deployment | Vercel |

## Architecture

```
Upload (question paper + answer sheet)
        │
        ▼
POST /api/process
        │
   ┌────┴────┐
   ▼         ▼
Question   Answer
extraction extraction
(Gemini)   (Gemini)
   │         │
   └────┬────┘
        ▼
  Answer mapping
  (label matching)
        │
        ▼
  Zod-validated JSON
        │
        ▼
   Review screen
```

Each extraction step prompts Gemini to return structured JSON only, which
is then parsed and validated against a Zod schema before it's trusted —
if Gemini's output doesn't match the expected shape, the request fails
with a clear error instead of passing malformed data downstream.

## Project structure

```
src/
  app/
    page.tsx              screen router (upload / processing / review)
    api/process/route.ts  extraction + mapping API route
  components/
    layout/                sidebar, header
    upload/                upload screen, file preview, processing screen
    review/                question list, answer sheet viewer, review screen
    ui/                    shadcn-generated primitives
  lib/
    gemini.ts               Gemini client
    question-extraction.ts  question paper -> structured questions
    answer-extraction.ts    answer sheet -> structured answers + regions
    answer-mapping.ts       label-based answer-to-question matching
    question-label.ts       parses labels like "11(a)" into parent/sub
    pdf.ts                  file size formatting, PDF page count
    store.ts                Zustand app state
  types/
    question.ts, answer.ts  shared types
```

## Running locally

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_key_here
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Known limitations

- **Matching is label-based only.** An answer only maps to a question if
  the student wrote a recognizable label (e.g. `2)`, `Q3`, `11(a)`).
  Unlabeled answers are extracted but shown as unmatched rather than
  guessed at semantically.
- **Grading and AI feedback are not implemented.** The review screen's
  data model supports a score and feedback per question, but the grading
  pipeline itself is a planned next step, not part of this submission.
- **Large PDFs are sent to Gemini as a single file** rather than split
  page-by-page, which is simpler but may hit size/token limits on very
  long answer sheets.

## Author

Kalmeshwar Birje
