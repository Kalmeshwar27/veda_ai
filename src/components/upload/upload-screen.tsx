"use client";

import { useState, useRef } from "react";
import { Upload, ArrowRight, Clock, Wifi, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize, getPdfPageCount } from "@/lib/pdf";
import { FilePreviewCard } from "@/components/upload/file-preview-card";
import { useAppStore } from "@/lib/store";
import Image from "next/image";

type FileSlot = "questionPaper" | "answerSheet";

type UploadedFile = {
  file: File;
  sizeLabel: string;
  pageLabel?: string;
};

export function UploadScreen() {
  const [questionPaper, setQuestionPaper] = useState<UploadedFile | null>(null);
  const [answerSheet, setAnswerSheet] = useState<UploadedFile | null>(null);

  const questionInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  const bothUploaded = Boolean(questionPaper && answerSheet);
  const setScreen = useAppStore((state) => state.setScreen);
  const setQuestionPaperFile = useAppStore((state) => state.setQuestionPaperFile);
  const setAnswerSheetFile = useAppStore((state) => state.setAnswerSheetFile);
  const handleStartMapping = () => {
    if (!questionPaper || !answerSheet) return;
    setQuestionPaperFile(questionPaper.file);
    setAnswerSheetFile(answerSheet.file);
    setScreen("processing");
  };
  const handleFileChange = async (slot: FileSlot, file: File | null) => {
    if (!file) {
      if (slot === "questionPaper") setQuestionPaper(null);
      else setAnswerSheet(null);
      return;
    }

    const pageCount = await getPdfPageCount(file);
    const uploaded: UploadedFile = {
      file,
      sizeLabel: formatFileSize(file.size),
      pageLabel: pageCount ? `${pageCount} Page${pageCount > 1 ? "s" : ""}` : undefined,
    };

    if (slot === "questionPaper") setQuestionPaper(uploaded);
    else setAnswerSheet(uploaded);
  };

  return (
    <div className="mx-auto flex h-dvh w-full max-w-3xl flex-col items-center justify-center gap-3 overflow-hidden px-4 py-3 md:h-screen md:gap-4 md:px-0 md:py-4">

      {/* Heading — plain black text on mobile, no top space */}
      <div className="flex w-full flex-col items-center gap-1 text-center">
        <h1 className="font-bricolage text-lg font-bold text-brand-dark sm:text-2xl md:text-3xl">
          Upload{" "}
          <span className="rounded-full bg-brand-orange-soft px-3 py-0.5 text-brand-dark md:text-brand-orange">
            Question Paper &amp; Answer Sheets
          </span>
        </h1>
        <p className="font-bricolage text-xs text-neutral-500 sm:text-m">
          Upload both files to get started
        </p>
      </div>

      <div className="relative h-20 w-20 shrink-0 sm:h-28 sm:w-28 md:h-40 md:w-40">
        <Image
          src="/images/upload-illustration.svg"
          alt="Upload illustration"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-3 rounded-[28px] bg-neutral-100 p-2.5 sm:grid-cols-2 sm:gap-4 sm:p-3">
        <UploadCard
          label="Question Paper"
          uploaded={questionPaper}
          inputRef={questionInputRef}
          onSelect={(file) => handleFileChange("questionPaper", file)}
        />
        <UploadCard
          label="Answer Sheet"
          uploaded={answerSheet}
          inputRef={answerInputRef}
          onSelect={(file) => handleFileChange("answerSheet", file)}
        />
      </div>

      <div className="font-bricolage flex shrink-0 flex-col items-center gap-1.5">
        <button
          type="button"
          disabled={!bothUploaded}
          onClick={handleStartMapping}
          className={cn(
            "flex items-center gap-2 rounded-full px-6 py-2 text-s font-semibold transition-colors sm:py-2.5",
            bothUploaded
              ? "bg-brand-dark text-white hover:opacity-90"
              : "cursor-not-allowed bg-neutral-400 text-white"
          )}
        >
          Start Mapping
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="font-bricolage px-4 text-center text-xs text-neutral-500 sm:text-m">
          Once both files are uploaded, you&apos;ll be able to map answers with questions
        </p>
      </div>
    </div>
  );
}

function UploadCard({
  label,
  uploaded,
  inputRef,
  onSelect,
}: {
  label: string;
  uploaded: UploadedFile | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSelect: (file: File | null) => void;
}) {
  return (
    <div
      onClick={() => {
        if (!uploaded) inputRef.current?.click();
      }}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border-dashed bg-white px-4 py-5 text-center sm:gap-3 sm:px-6 sm:py-8",
        !uploaded && "cursor-pointer hover:border-brand-orange/40"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
      />

      {uploaded ? (
        <FilePreviewCard
          fileName={uploaded.file.name}
          sizeLabel={uploaded.sizeLabel}
          pageLabel={uploaded.pageLabel}
          onRemove={() => onSelect(null)}
        />
      ) : (
        <>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-icon-bg text-neutral-800 sm:h-12 sm:w-12">
            <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <span className="font-bricolage text-s font-semibold text-neutral-900 sm:text-m">
            Upload <span className="text-brand-orange">{label}</span>
          </span>
          <span className="font-bricolage text-xs text-neutral-400 sm:text-m">Max 10MB</span>
        </>
      )}
    </div>
  );
}
