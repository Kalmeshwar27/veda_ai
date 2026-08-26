export type AnswerRegion = {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ExtractedAnswer = {
  detectedLabel: string | null;
  text: string;
  regions: AnswerRegion[];
};

export type AnswerExtractionResult = {
  answers: ExtractedAnswer[];
};

export type MappingConfidence = "high" | "medium" | "unmatched";

export type MappedAnswer = {
  questionId: string | null;
  answer: ExtractedAnswer | null;
  confidence: MappingConfidence;
};