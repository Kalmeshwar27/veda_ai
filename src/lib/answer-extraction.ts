import { z } from "zod";
import { ai, GEMINI_MODEL, fileToPart } from "@/lib/gemini";
import type { ExtractedAnswer } from "@/types/answer";

const regionSchema = z.object({
  page: z.number(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

const answerSchema = z.object({
  detectedLabel: z.string().nullable(),
  text: z.string(),
  regions: z.array(regionSchema),
});

const answerExtractionSchema = z.object({
  answers: z.array(answerSchema),
});

const EXTRACTION_PROMPT = `
You are analyzing a handwritten student answer sheet, page by page.

Rules:
- Identify each distinct answer block written by the student.
- If a question label is visible (e.g. Q1, 1), 11(a)), set detectedLabel to it exactly as written.
- If no label is visible or it is illegible, set detectedLabel to null.
- For each answer block, record its bounding region using normalized coordinates
  between 0 and 1, relative to the page width and height: x, y is the top-left
  corner, width and height are the box size.
- If an answer continues onto another page, include one region per page under
  the same answer's "regions" array.
- Return ONLY valid JSON matching this shape, no markdown fences, no commentary:

{
  "answers": [
    {
      "detectedLabel": "11(a)",
      "text": "...",
      "regions": [{ "page": 3, "x": 0.12, "y": 0.34, "width": 0.76, "height": 0.28 }]
    }
  ]
}
`;

export async function extractAnswers(
  fileBuffer: Buffer,
  mimeType: string
): Promise<ExtractedAnswer[]> {
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
    throw new Error("Gemini did not return valid JSON for answer extraction");
  }

  const result = answerExtractionSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Answer extraction result failed validation: ${result.error.message}`
    );
  }

  return result.data.answers;
}