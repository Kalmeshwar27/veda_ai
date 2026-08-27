import { NextRequest, NextResponse } from "next/server";
import { extractQuestions } from "@/lib/question-extraction";
import { extractAnswers } from "@/lib/answer-extraction";
import { mapAnswersToQuestions } from "@/lib/answer-mapping";
import { gradeAnswers } from "@/lib/grading";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const questionPaper = formData.get("questionPaper");
  const answerSheet = formData.get("answerSheet");

  if (!(questionPaper instanceof File) || !(answerSheet instanceof File)) {
    return NextResponse.json(
      { error: "Both questionPaper and answerSheet files are required" },
      { status: 400 }
    );
  }

  try {
    const questionBuffer = Buffer.from(await questionPaper.arrayBuffer());
    const answerBuffer = Buffer.from(await answerSheet.arrayBuffer());

    const [questions, answers] = await Promise.all([
      extractQuestions(questionBuffer, questionPaper.type),
      extractAnswers(answerBuffer, answerSheet.type),
    ]);

    const mapped = mapAnswersToQuestions(questions, answers);

    const { grades, summary } = await gradeAnswers(questions, mapped);

    return NextResponse.json({ questions, answers, mapped, grades, summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}