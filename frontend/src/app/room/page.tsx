"use client";

import { RoomCanvas } from "@/components/RoomCanvas/RoomCanvas";

export default function Room() {
  return (
    <main className="bg-paper box-border flex h-screen w-screen flex-col">
      <RoomCanvas />
    </main>
  );
}
