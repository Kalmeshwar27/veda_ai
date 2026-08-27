export type Question = {
  id: string;
  label: string;
  text: string;
  order: number;
  marks?: number;
};

export type QuestionExtractionResult = {
  questions: Question[];
};

export type GradeStatus = "correct" | "partial" | "incorrect" | "unanswered";

export type QuestionGrade = {
  obtained: number;
  max: number;
  status: GradeStatus;
  feedback: string;
};

export type GradingSummary = {
  totalObtained: number;
  totalMax: number;
  summary: string;
};