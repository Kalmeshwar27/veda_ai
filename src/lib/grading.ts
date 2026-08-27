import { z } from "zod";
import { ai, GEMINI_MODEL } from "@/lib/gemini";
import type { Question, QuestionGrade, GradingSummary } from "@/types/question";
import type { MappedAnswer } from "@/types/answer";

const gradeSchema = z.object({
  questionId: z.string(),
  obtained: z.number(),
  max: z.number(),
  status: z.enum(["correct", "partial", "incorrect", "unanswered"]),
  feedback: z.string(),
});

const gradingResultSchema = z.object({
  grades: z.array(gradeSchema),
  summary: z.object({
    totalObtained: z.number(),
    totalMax: z.number(),
    summary: z.string(),
  }),
});

const DEFAULT_MAX_MARKS = 5;

function buildGradingInput(questions: Question[], mapped: MappedAnswer[]) {
  return questions.map((question) => {
    const match = mapped.find((m) => m.questionId === question.id);
    return {
      id: question.id,
      label: question.label,
      question: question.text,
      maxMarks: question.marks ?? DEFAULT_MAX_MARKS,
      studentAnswer: match?.answer?.text ?? null,
    };
  });
}

const GRADING_PROMPT = `
You are grading a student's handwritten answers against a question paper.
You will receive a JSON array of questions, each with the question text,
its maximum marks, and the student's answer text (or null if the student
did not answer that question).

Rules:
- If studentAnswer is null, the question is unanswered: obtained is 0,
  status is "unanswered", and feedback should note no answer was found.
- Grade each answer on correctness and completeness relative to the
  question, using the given maxMarks as the ceiling for that question.
- status is "correct" for full or near-full marks, "partial" for a
  partially correct or incomplete answer, "incorrect" for a wrong or
  irrelevant answer, "unanswered" only when studentAnswer is null.
- feedback must be specific to that answer: what was right, what was
  missing, and what would improve it. Keep it to two or three sentences.
- After grading every question, compute totalObtained and totalMax as
  the sum across all questions, and write a short overall summary of
  the student's performance across the whole paper.
- Return ONLY valid JSON matching this shape, no markdown fences, no
  commentary:

{
  "grades": [
    { "questionId": "q1", "obtained": 4, "max": 5, "status": "correct", "feedback": "..." }
  ],
  "summary": { "totalObtained": 4, "totalMax": 5, "summary": "..." }
}
`;

export async function gradeAnswers(
  questions: Question[],
  mapped: MappedAnswer[]
): Promise<{ grades: Record<string, QuestionGrade>; summary: GradingSummary }> {
  const input = buildGradingInput(questions, mapped);

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: GRADING_PROMPT },
          { text: JSON.stringify(input) },
        ],
      },
    ],
  });

  const rawText = response.text ?? "";
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini did not return valid JSON for grading");
  }

  const result = gradingResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Grading result failed validation: ${result.error.message}`);
  }

  const grades: Record<string, QuestionGrade> = {};
  for (const grade of result.data.grades) {
    grades[grade.questionId] = {
      obtained: grade.obtained,
      max: grade.max,
      status: grade.status,
      feedback: grade.feedback,
    };
  }

  return { grades, summary: result.data.summary };
}