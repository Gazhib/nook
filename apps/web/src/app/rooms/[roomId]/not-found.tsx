"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SketchButton } from "@/components/Button";
import { Wordmark } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { createRoomService } from "@/services/roomServices";

export default function RoomNotFound() {
  const router = useRouter();
  const pending = useRef(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const handleStartRoom = async () => {
    if (pending.current) return;
    pending.current = true;
    setIsCreating(true);
    try {
      const id = await createRoomService();
      router.push(`/rooms/${id}`);
    } catch {
      pending.current = false;
      setIsCreating(false);
      setError("We couldn't create a room. Please try again.");
    }
  };
  return (
    <main className="flex min-h-dvh flex-col px-6 py-7 sm:px-10">
      <Wordmark size={24} />
      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-hair bg-fill-2 text-accent">
          <Icon name="lock" size={30} />
        </div>
        <p className="eyebrow mb-4 text-muted">A closed door, for now</p>
        <h1 className="max-w-lg font-display text-4xl tracking-tight sm:text-5xl">
          This room is not available.
        </h1>
        <p className="mb-8 mt-5 max-w-sm text-sm leading-relaxed text-muted">
          The link may be incorrect, or you may need an invitation from the
          owner of the room.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/rooms" className="nook-button nook-button-primary">
            <Icon name="back" size={15} />
            Your rooms
          </Link>
          <SketchButton onClick={handleStartRoom} disabled={isCreating}>
            {isCreating ? "Creating room…" : "Create a new room"}
          </SketchButton>
        </div>
        {error && (
          <p role="alert" className="mt-5 text-xs text-red-700">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
