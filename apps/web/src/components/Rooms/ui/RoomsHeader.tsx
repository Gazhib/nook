"use client";

import { useState } from "react";
import { Wordmark } from "../../Logo";
import { HelpModal } from "./HelpModal";

export const RoomsHeader = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="flex h-12 shrink-0 items-center gap-4 border-b border-hair bg-white px-5">
      <Wordmark size={18} />
      <div className="flex-1" />
      <button
        type="button"
        onClick={() => setIsHelpOpen(true)}
        className="cursor-pointer font-body text-[13px] text-muted transition-colors hover:text-ink"
      >
        Help
      </button>
      <HelpModal open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};