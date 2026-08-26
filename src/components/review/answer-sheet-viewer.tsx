"use client";

import { useMemo, useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "@/lib/pdf-worker";
import { useAppStore } from "@/lib/store";
import { parseQuestionLabel } from "@/lib/question-label";

export function AnswerSheetViewer() {
  const answerSheetFile = useAppStore((state) => state.answerSheetFile);
  const questions = useAppStore((state) => state.questions);
  const mappedAnswers = useAppStore((state) => state.mappedAnswers);
  const selectedQuestionId = useAppStore((state) => state.selectedQuestionId);

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  const selectedMatch = mappedAnswers.find(
    (m) => m.questionId === selectedQuestionId
  );

  useEffect(() => {
    const firstRegion = selectedMatch?.answer?.regions[0];
    if (firstRegion) {
      setPageNumber(firstRegion.page);
    }
  }, [selectedMatch]);

  const highlightsOnPage = useMemo(() => {
    if (!selectedMatch?.answer || !selectedQuestion) return [];
    return selectedMatch.answer.regions
      .filter((region) => region.page === pageNumber)
      .map((region) => ({ region, label: selectedQuestion.label }));
  }, [selectedMatch, selectedQuestion, pageNumber]);

  if (!answerSheetFile) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
        No answer sheet loaded
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between bg-brand-dark px-4 py-2.5 text-white">
        <span className="text-sm font-medium">Answer Sheet</span>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/10"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-10 text-center text-xs">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(2, s + 0.1))}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/10"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
            <button
              type="button"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <span className="text-xs">
              Page {pageNumber} of {numPages || 1}
            </span>
            <button
              type="button"
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-surface-muted p-6">
        <div className="relative mx-auto w-fit">
          <Document
            file={answerSheetFile}
            onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
          >
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>

          {highlightsOnPage.map(({ region, label }, index) => {
            const { parent } = parseQuestionLabel(label);
            return (
              <div
                key={index}
                className="absolute rounded-lg border-2 border-emerald-400 bg-emerald-300/20"
                style={{
                  left: `${region.x * 100}%`,
                  top: `${region.y * 100}%`,
                  width: `${region.width * 100}%`,
                  height: `${region.height * 100}%`,
                }}
              >
                <span className="absolute -top-3 left-2 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Q{parent}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}