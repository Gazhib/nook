"use client";

import { useState } from "react";
import { Wordmark } from "../../Logo";
import { Icon } from "../../Icon";
import { HelpModal } from "./HelpModal";

export const RoomsHeader = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-hair bg-[#fcfcf8] px-5 sm:px-8">
      <div className="flex items-center gap-8">
        <Wordmark size={24} />
        <span className="hidden border-l border-hair pl-8 text-xs text-muted sm:block">
          A little room for possibility.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setIsHelpOpen(true)}
        className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs text-ink-2 hover:bg-fill"
      >
        <Icon name="help" size={16} />
        Help & shortcuts
      </button>
      <HelpModal open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </header>
  );
};
