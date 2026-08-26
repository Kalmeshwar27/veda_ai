"use client";

import { ArrowLeft, Clipboard, HelpCircle, Bell, Sparkles, ChevronDown, CircleUserRound } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border-dashed bg-white px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Go back"
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 hover:bg-surface-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-neutral-500">
          <Clipboard className="h-4 w-4" />
          <span className="text-sm">Exams</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Help"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border-dashed text-neutral-600 hover:bg-surface-muted"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border-dashed text-neutral-600 hover:bg-surface-muted"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-orange" />
        </button>

        <button
          type="button"
          aria-label="AI assistant"
          className="flex h-9 w-9 items-center justify-center text-neutral-800 hover:opacity-70"
        >
          <Sparkles className="h-4 w-4" />
        </button>

        <button type="button" className="flex items-center gap-2 pl-1">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-surface-muted text-neutral-500">
            <CircleUserRound className="h-6 w-6" />
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            Madhur Rastogi
          </span>
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        </button>
      </div>
    </header>
  );
}