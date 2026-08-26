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
    <div className="mx-auto flex h-screen max-w-3xl flex-col items-center justify-center gap-4 overflow-hidden py-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="relative inline-flex items-center justify-center px-5 py-2">
          <Image
            src="/images/upload-frame.svg"
            alt="frame"
            width={850}
            height={600}
          />
        </span>
      </div>

      <div className="relative h-40 w-40">
        <Image
          src="/images/upload-illustration.svg"
          alt="Upload illustration"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 rounded-[28px] bg-neutral-100 p-3 sm:grid-cols-2">
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

      <div className="font-bricolage flex flex-col items-center gap-2">
        <button
          type="button"
          disabled={!bothUploaded}
          onClick={handleStartMapping}
          className={cn(
            "flex items-center gap-2 rounded-full px-6 py-2.5 text-s font-semibold transition-colors",
            bothUploaded
              ? "bg-brand-dark text-white hover:opacity-90"
              : "cursor-not-allowed bg-neutral-400 text-white"
          )}
        >
          Start Mapping
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="font-bricolage text-m text-neutral-500">
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
        "flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border-dashed bg-white px-6 py-8 text-center",
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
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-icon-bg text-neutral-800">
            <Upload className="h-5 w-5" />
          </span>
          <span className="font-bricolage text-m font-semibold text-neutral-900">
            Upload <span className="text-brand-orange">{label}</span>
          </span>
          <span className="font-bricolage text-m text-neutral-400">Max 10MB</span>
        </>
      )}
    </div>
  );
}