"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { QuestionListPanel } from "@/components/review/question-list-panel";
import { cn } from "@/lib/utils";

const AnswerSheetViewer = dynamic(
  () =>
    import("@/components/review/answer-sheet-viewer").then(
      (mod) => mod.AnswerSheetViewer
    ),
  { ssr: false }
);

type MobileTab = "questions" | "answer";

export function ReviewScreen() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("questions");

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row md:gap-4">
      <div className="flex justify-center md:hidden">
        <div className="flex rounded-full bg-surface-muted p-1">
          <button
            type="button"
            onClick={() => setMobileTab("questions")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              mobileTab === "questions"
                ? "bg-brand-dark text-white"
                : "text-neutral-500"
            )}
          >
            Questions
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("answer")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              mobileTab === "answer"
                ? "bg-brand-dark text-white"
                : "text-neutral-500"
            )}
          >
            Answer Sheet
          </button>
        </div>
      </div>

      <div
        className={cn(
          "min-h-0 overflow-hidden rounded-2xl border border-border-dashed bg-white md:block md:w-[420px] md:shrink-0",
          mobileTab === "questions" ? "block flex-1" : "hidden"
        )}
      >
        <QuestionListPanel />
      </div>

      <div
        className={cn(
          "min-h-0 overflow-hidden rounded-2xl border border-border-dashed bg-white md:block md:flex-1",
          mobileTab === "answer" ? "block flex-1" : "hidden"
        )}
      >
        <AnswerSheetViewer />
      </div>
    </div>
  );
}