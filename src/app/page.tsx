"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { UploadScreen } from "@/components/upload/upload-screen";
import { ProcessingScreen } from "@/components/upload/processing-screen";
import { ReviewScreen } from "@/components/review/review-screen";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const screen = useAppStore((state) => state.screen);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-200">
      <Sidebar
        isMobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-hidden bg-app-canvas p-4 md:p-6">
          {screen === "upload" && <UploadScreen />}
          {screen === "processing" && <ProcessingScreen />}
          {screen === "review" && <ReviewScreen />}
        </main>
      </div>
    </div>
  );
}