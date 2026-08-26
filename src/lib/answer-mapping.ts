import type { Question } from "@/types/question";
import type { ExtractedAnswer, MappedAnswer } from "@/types/answer";

function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/[().\s]/g, "");
}

export function mapAnswersToQuestions(
  questions: Question[],
  answers: ExtractedAnswer[]
): MappedAnswer[] {
  const usedAnswerIndexes = new Set<number>();
  const mapped: MappedAnswer[] = [];

  for (const question of questions) {
    const normalizedQuestionLabel = normalizeLabel(question.label);

    const matchIndex = answers.findIndex((answer, index) => {
      if (usedAnswerIndexes.has(index)) return false;
      if (!answer.detectedLabel) return false;
      return normalizeLabel(answer.detectedLabel) === normalizedQuestionLabel;
    });

    if (matchIndex !== -1) {
      usedAnswerIndexes.add(matchIndex);
      mapped.push({
        questionId: question.id,
        answer: answers[matchIndex],
        confidence: "high",
      });
      continue;
    }

    mapped.push({
      questionId: question.id,
      answer: null,
      confidence: "unmatched",
    });
  }

  const unmatchedAnswers = answers.filter(
    (_, index) => !usedAnswerIndexes.has(index)
  );

  for (const answer of unmatchedAnswers) {
    mapped.push({
      questionId: null,
      answer,
      confidence: "unmatched",
    });
  }

  return mapped;
}