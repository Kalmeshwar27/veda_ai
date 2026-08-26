import { z } from "zod";
import { ai, GEMINI_MODEL, fileToPart } from "@/lib/gemini";
import type { Question } from "@/types/question";

const questionSchema = z.object({
  id: z.string(),
  label: z.string(),
  text: z.string(),
  order: z.number(),
  marks: z.number().optional(),
});

const questionExtractionSchema = z.object({
  questions: z.array(questionSchema),
});

const EXTRACTION_PROMPT = `
You are analyzing a scanned question paper. Extract every question in the
exact order it appears on the page.

Rules:
- Preserve numbering exactly as printed, including sub-parts like 11(a) and 11(b).
- Treat each sub-part as an independent question with its own id and order.
- "order" must reflect the reading order on the page, starting at 1.
- If marks are printed next to a question, include them as a number.
- Return ONLY valid JSON matching this shape, no markdown fences, no commentary:

{
  "questions": [
    { "id": "q1", "label": "1", "text": "...", "order": 1, "marks": 2 }
  ]
}
`;

export async function extractQuestions(
  fileBuffer: Buffer,
  mimeType: string
): Promise<Question[]> {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [fileToPart(fileBuffer, mimeType), { text: EXTRACTION_PROMPT }],
      },
    ],
  });

  const rawText = response.text ?? "";
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini did not return valid JSON for question extraction");
  }

  const result = questionExtractionSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Question extraction result failed validation: ${result.error.message}`
    );
  }

  return result.data.questions;
}