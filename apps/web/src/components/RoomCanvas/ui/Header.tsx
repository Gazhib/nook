'use client';

import { SketchButton } from "@/components/Button";
import { Wordmark } from "@/components/Logo";
import { useRouter } from "next/navigation";

export const Header = ({ onShare }: { onShare: () => void }) => {
  const router = useRouter();
  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-hair bg-white px-4 max-w-screen">
      <Wordmark onClick={() => router.push("/")} size={18} />
      <div className="h-5 w-px bg-hair" />
      <div className="flex items-center gap-1.5 font-display text-sm font-medium text-ink">
        Studio apartment
        <span className="rounded-[3px] border border-hair px-[5px] py-0.5 font-mono text-[10px] text-muted">
          r/apt-8K2
        </span>
      </div>
      <div className="flex-1" />
      <div className="mr-2 flex">
        {/* <SketchAvatar size={26} label="A" color="#7A8F6B" ring /> */}
        {/* <div className="-ml-1.5"><SketchAvatar size={26} label="M" color="#B8563E" /></div> */}
        {/* <div className="-ml-1.5"><SketchAvatar size={26} label="J" color="#8a7ba0" /></div> */}
      </div>
      <SketchButton onClick={onShare} primary className="cursor-pointer">
        <svg
          width={13}
          height={13}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8.6 13.5 L15.4 17.5 M15.4 6.5 L8.6 10.5" />
          <circle cx="6" cy="12" r="2.6" fill="currentColor" stroke="none" />
          <circle cx="18" cy="5.5" r="2.6" fill="currentColor" stroke="none" />
          <circle cx="18" cy="18.5" r="2.6" fill="currentColor" stroke="none" />
        </svg>

        <button className="ml-1.5">Share</button>
      </SketchButton>
      {/* <SketchAvatar size={26} label="Y" /> */}
    </header>
  );
};
