"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseQuestionLabel } from "@/lib/question-label";
import type { Question, QuestionGrade } from "@/types/question";

const scorePillStyles: Record<QuestionGrade["status"], string> = {
  correct: "bg-emerald-50 text-emerald-600",
  partial: "bg-amber-50 text-amber-600",
  incorrect: "bg-rose-50 text-rose-500",
  unanswered: "bg-neutral-100 text-neutral-400",
};

export function QuestionCard({
  question,
  grade,
  isSelected,
  isExpanded,
  onToggle,
}: {
  question: Question;
  grade: QuestionGrade | undefined;
  isSelected: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { parent, sub } = parseQuestionLabel(question.label);

  return (
    <div
      className={cn(
        "rounded-xl border bg-white transition-colors",
        isSelected ? "border-brand-orange" : "border-transparent"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-3 text-left"
      >
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
            isSelected ? "bg-brand-orange" : "bg-neutral-800"
          )}
        >
          {parent}
        </span>

        {sub && (
          <span className="mt-1 text-sm font-medium text-neutral-400">
            {sub}.
          </span>
        )}

        <span className="flex-1 text-sm text-neutral-700">{question.text}</span>

        {grade && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              scorePillStyles[grade.status]
            )}
          >
            {grade.obtained}/{grade.max}
          </span>
        )}

        <span className="mt-0.5 shrink-0 text-neutral-400">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>

      {isExpanded && grade?.feedback && (
        <div className="mx-4 mb-4 rounded-lg bg-surface-muted px-3 py-3">
          <p className="text-sm font-semibold text-neutral-900">AI Feedback</p>
          <p className="mt-1 text-sm text-neutral-500">{grade.feedback}</p>
        </div>
      )}
    </div>
  );
}