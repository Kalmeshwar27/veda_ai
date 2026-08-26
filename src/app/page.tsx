"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { UploadScreen } from "@/components/upload/upload-screen";
import { ProcessingScreen } from "@/components/upload/processing-screen";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const screen = useAppStore((state) => state.screen);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-app-canvas p-6">
          {screen === "upload" && <UploadScreen />}
          {screen === "processing" && <ProcessingScreen />}
        </main>
      </div>
    </div>
  );
}