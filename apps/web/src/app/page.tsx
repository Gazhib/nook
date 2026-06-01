"use client";

import { SketchButton } from "@/components/Button";
import { Wordmark } from "@/components/Logo";
import { TopDownRoom } from "@/components/TopDownRoom";
import { createRoomService } from "@/services/roomServices";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleStartRoom = async () => {
    const roomId = await createRoomService();
    router.push(`/room/${roomId}`);
  };

  return (
    <main className="bg-paper relative box-border flex min-h-screen max-w-screen flex-col px-[40px] py-[32px]">
      <div className="mb-14 flex items-center justify-between">
        <Wordmark size={22} />
        <div className="font-body text-muted text-[13px]">
          built by one person, not a company
        </div>
      </div>

      <div className="mx-auto max-w-[680px] text-center">
        <div className="font-display text-ink text-[64px] font-medium leading-none tracking-[-2px]">
          Plan your space,
          <br />
          <span className="text-accent font-normal italic">together.</span>
        </div>

        <div className="font-body text-ink-2 mt-6 text-[17px] leading-[1.5]">
          Drag, drop, and decide together —
          <br />
          before the couch actually arrives.
        </div>

        <div className="mt-8 inline-flex gap-[10px]">
          <SketchButton primary className="px-4 py-3">
            <button className="h-full w-full cursor-pointer" onClick={handleStartRoom}>Start a room →</button>
          </SketchButton>
          <SketchButton ghost className="px-4 py-3">
            See it work
          </SketchButton>
        </div>
      </div>

      <div className="border-hair mx-auto mt-12 max-w-[920px] overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-hair flex h-7 items-center gap-2 border-b px-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-hair-2 h-2 w-2 rounded-full" />
          ))}

          <div className="flex-1" />

          <div className="font-mono text-muted text-[10px]">
            nook.app/room/apt-living
          </div>
        </div>

        <TopDownRoom w={920} h={280} selectedId="armchair" />
      </div>
    </main>
  );
}
