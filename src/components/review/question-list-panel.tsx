"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { QuestionCard } from "@/components/review/question-card";

export function QuestionListPanel() {
  const questions = useAppStore((state) => state.questions);
  const grades = useAppStore((state) => state.grades);
  const selectedQuestionId = useAppStore((state) => state.selectedQuestionId);
  const setSelectedQuestionId = useAppStore((state) => state.setSelectedQuestionId);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const allExpanded = questions.length > 0 && expandedIds.size === questions.length;

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(questions.map((q) => q.id)));
    }
  };

  const toggleQuestion = (id: string) => {
    setSelectedQuestionId(id);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border-dashed px-4 py-3">
        <span className="text-sm font-semibold text-neutral-900">
          Extracted Questions (from question paper)
        </span>
        <button
          type="button"
          onClick={toggleExpandAll}
          className="rounded-full border border-border-dashed px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-surface-muted"
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            grade={grades[question.id]}
            isSelected={selectedQuestionId === question.id}
            isExpanded={expandedIds.has(question.id)}
            onToggle={() => toggleQuestion(question.id)}
          />
        ))}
      </div>
    </div>
  );
}