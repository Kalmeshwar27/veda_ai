import { create } from "zustand";
import type { Question, QuestionGrade } from "@/types/question";
import type { MappedAnswer } from "@/types/answer";

export type Screen = "upload" | "processing" | "review";

type AppState = {
  screen: Screen;
  questionPaperFile: File | null;
  answerSheetFile: File | null;
  questions: Question[];
  mappedAnswers: MappedAnswer[];
  grades: Record<string, QuestionGrade>;
  selectedQuestionId: string | null;
  processingError: string | null;
  setScreen: (screen: Screen) => void;
  setQuestionPaperFile: (file: File | null) => void;
  setAnswerSheetFile: (file: File | null) => void;
  setProcessingResult: (questions: Question[], mappedAnswers: MappedAnswer[]) => void;
  setSelectedQuestionId: (id: string | null) => void;
  setProcessingError: (error: string | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  screen: "upload",
  questionPaperFile: null,
  answerSheetFile: null,
  questions: [],
  mappedAnswers: [],
  grades: {},
  selectedQuestionId: null,
  processingError: null,
  setScreen: (screen) => set({ screen }),
  setQuestionPaperFile: (file) => set({ questionPaperFile: file }),
  setAnswerSheetFile: (file) => set({ answerSheetFile: file }),
  setProcessingResult: (questions, mappedAnswers) =>
    set({
      questions,
      mappedAnswers,
      selectedQuestionId: questions[0]?.id ?? null,
    }),
  setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),
  setProcessingError: (error) => set({ processingError: error }),
}));