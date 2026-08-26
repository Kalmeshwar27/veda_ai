"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function ProcessingScreen() {
  const questionPaperFile = useAppStore((state) => state.questionPaperFile);
  const answerSheetFile = useAppStore((state) => state.answerSheetFile);
  const setProcessingResult = useAppStore((state) => state.setProcessingResult);
  const setScreen = useAppStore((state) => state.setScreen);
  const processingError = useAppStore((state) => state.processingError);
  const setProcessingError = useAppStore((state) => state.setProcessingError);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!questionPaperFile || !answerSheetFile) {
      setProcessingError("Missing question paper or answer sheet file");
      return;
    }

    let cancelled = false;
    setProcessingError(null);

    const run = async () => {
      try {
        const formData = new FormData();
        formData.append("questionPaper", questionPaperFile);
        formData.append("answerSheet", answerSheetFile);

        const response = await fetch("/api/process", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Processing failed");
        }

        if (cancelled) return;

        setProcessingResult(data.questions, data.mapped);
        setScreen("review");
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Processing failed";
        setProcessingError(message);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [questionPaperFile, answerSheetFile, attempt, setProcessingResult, setScreen, setProcessingError]);

  if (processingError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <AlertCircle className="h-6 w-6" />
        </span>
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-bold text-neutral-900">
            Something went wrong
          </span>
          <span className="max-w-sm text-sm text-neutral-500">
            {processingError}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setScreen("upload")}
            className="rounded-full border border-border-dashed px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-surface-muted"
          >
            Back to Upload
          </button>
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="rounded-full bg-brand-dark px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-16 w-16 text-brand-orange" strokeWidth={1.5} fill="currentColor" />
      </motion.div>

      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-lg font-bold text-neutral-900">Extracting...</span>
        <span className="text-sm text-neutral-500">This may take a while</span>
      </div>
    </div>
  );
}