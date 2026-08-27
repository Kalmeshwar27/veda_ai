"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkle, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

const twinkleTransition = (delay: number) => ({
  duration: 1.4,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut" as const,
  delay,
});

function SparkleCluster() {
  return (
    <div className="relative h-28 w-28">
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [0.85, 1, 0.85], opacity: [0.7, 1, 0.7] }}
        transition={twinkleTransition(0)}
      >
        <Sparkle
          className="h-16 w-16 text-brand-orange"
          fill="currentColor"
          strokeWidth={0}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-2 left-1"
        animate={{ scale: [0.7, 1, 0.7], opacity: [0.5, 1, 0.5] }}
        transition={twinkleTransition(0.35)}
      >
        <Sparkle
          className="h-8 w-8 text-brand-orange"
          fill="currentColor"
          strokeWidth={0}
        />
      </motion.div>

      <motion.div
        className="absolute right-0 top-3"
        animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
        transition={twinkleTransition(0.7)}
      >
        <Sparkle
          className="h-5 w-5 text-brand-orange"
          fill="currentColor"
          strokeWidth={0}
        />
      </motion.div>

      <motion.div
        className="absolute left-2 top-6 h-2 w-2 rounded-full bg-brand-orange"
        animate={{ scale: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4] }}
        transition={twinkleTransition(1.05)}
      />
    </div>
  );
}

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
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <SparkleCluster />

      <div className="flex flex-col items-center gap-1 text-center">
        <span className="font-bricolage text-lg font-bold text-neutral-900">Extracting...</span>
        <span className="font-bricolage text-sm text-neutral-500">This may take a while</span>
      </div>
    </div>
  );
}