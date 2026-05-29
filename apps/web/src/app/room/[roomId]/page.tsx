"use client";

import { RoomCanvas } from "@/components/RoomCanvas/RoomCanvas";
import { use } from "react";

export default function Room({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);

  return (
    <main className="bg-paper box-border flex h-screen w-screen flex-col">
      <RoomCanvas roomId={roomId} />
    </main>
  );
}
