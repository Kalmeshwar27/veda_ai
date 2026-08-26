"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function ProcessingScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-16 w-16 text-brand-orange" strokeWidth={1.5} fill="currentColor" />
      </motion.div>

      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-lg font-bold text-neutral-900">Extracting...</span>
        <span className="text-sm text-neutral-500">This may take a while</span>
      </div>
    </div>
  );
}