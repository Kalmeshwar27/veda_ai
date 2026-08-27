"use client";

import {
  LayoutGrid,
  Presentation,
  FileText,
  Clipboard,
  PieChart,
  Settings,
  PanelLeft,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { label: "Home", icon: LayoutGrid },
  { label: "My Classroom", icon: Presentation },
  { label: "Assignments", icon: FileText },
  { label: "Exams", icon: Clipboard },
  { label: "My Library", icon: PieChart },
];

function SidebarContent({ onCloseClick }: { onCloseClick?: () => void }) {
  const activeItem = "Exams";

  return (
    <div className="flex h-full flex-col justify-between px-4 py-5">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-brand-dark text-white">
              <Image
                src="/images/v.svg"
                alt="VedaAI logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="font-bricolag text-lg font-bold weight-700">VedaAI</span>
          </div>
          <button
            type="button"
            aria-label={onCloseClick ? "Close menu" : "Toggle sidebar"}
            onClick={onCloseClick}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-surface-muted"
          >
            {onCloseClick ? <X className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-full bg-[#272727] px-4 py-2.5 text-sm font-semibold text-white ring-2 ring-brand-ring"
        >
          <Sparkles className="h-4 w-4" />
          AI Teacher&apos;s Toolkit
        </button>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.label === activeItem;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-surface-muted font-semibold text-neutral-900"
                    : "text-neutral-500 hover:bg-surface-muted/60"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-500 hover:bg-surface-muted/60"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
            <Image
              src="/images/school.svg"
              alt="Delhi Public School logo"
              width={70}
              height={70}
              className="object-contain"
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-bricolage text-sm font-semibold text-neutral-900">
              Delhi Public School
            </span>
            <span className="text-xs text-neutral-500">Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  isMobileOpen = false,
  onMobileClose,
}: {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  return (
    <>
      {/* Desktop sidebar — now a rounded floating panel */}
      <aside className="hidden h-[calc(100vh-1rem)] w-[260px] shrink-0 rounded-2xl border border-border-dashed bg-white shadow-sm md:my-2 md:ml-2 md:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer — unchanged */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!isMobileOpen}
      >
        <div
          onClick={onMobileClose}
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-200",
            isMobileOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-[260px] max-w-[80%] bg-white shadow-xl transition-transform duration-200",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent onCloseClick={onMobileClose} />
        </aside>
      </div>
    </>
  );
}