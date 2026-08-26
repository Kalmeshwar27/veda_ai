"use client";

import { X, FileText } from "lucide-react";

export function FilePreviewCard({
  fileName,
  sizeLabel,
  pageLabel,
  onRemove,
}: {
  fileName: string;
  sizeLabel: string;
  pageLabel?: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative flex w-full items-center gap-3 rounded-xl bg-surface-muted px-3 py-3">
      <span className="flex h-10 w-8 shrink-0 items-center justify-center rounded-md bg-[#DE534E] text-[10px] font-bold text-white">
        <FileText className="h-4 w-4" />
      </span>
      <div className="flex min-w-0 flex-col text-left">
        <span className="truncate text-sm font-semibold text-neutral-900">
          {fileName}
        </span>
        <span className="text-xs text-neutral-400">
          {sizeLabel}
          {pageLabel ? ` \u2022 ${pageLabel}` : ""}
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label="Remove file"
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white hover:bg-neutral-800"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}