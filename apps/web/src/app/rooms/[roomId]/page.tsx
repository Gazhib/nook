"use client";

import { Header } from "@/components/RoomCanvas/ui/Header";
import { RoomCanvas } from "@/components/RoomCanvas/ui/RoomCanvas";
import { ShareModal } from "@/features/Share/ui/ShareModal";
import { use, useState } from "react";

export default function Room({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const [open, setOpen] = useState(false);
  return (
    <main className="bg-paper box-border flex h-screen w-screen flex-col overflow-y-hidden">
      <Header
        onShare={() => {
          setOpen(true);
        }}
        roomId={roomId}
      />
      <RoomCanvas roomId={roomId} />
      <ShareModal onClose={() => setOpen(false)} open={open} />
    </main>
  );
}
