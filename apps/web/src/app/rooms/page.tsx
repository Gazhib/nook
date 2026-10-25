"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SketchButton } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { useMyRooms } from "@/components/Rooms/model/useMyRooms";
import { RoomCard } from "@/components/Rooms/ui/RoomCard";
import { RoomsHeader } from "@/components/Rooms/ui/RoomsHeader";
import { RoomsSidebar } from "@/components/Rooms/ui/RoomsSidebar";
import { createRoomService } from "@/services/roomServices";

export default function Rooms() {
  const { setSortBy, sortBy, sortByOptions, rooms, isLoading, error, retry } =
    useMyRooms();
  const router = useRouter();
  const creatingRef = useRef(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const handleStartRoom = async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;
    setIsCreating(true);
    setCreateError("");
    try {
      const roomId = await createRoomService();
      router.push(`/rooms/${roomId}`);
    } catch {
      setCreateError("We couldn't create your room. Please try again.");
      creatingRef.current = false;
      setIsCreating(false);
    }
  };
  return (
    <main className="flex min-h-dvh w-full flex-col bg-paper">
      <RoomsHeader />
      <div className="flex flex-1">
        <RoomsSidebar />
        <div className="mx-auto w-full min-w-0 max-w-[1440px] flex-1 px-5 py-8 sm:px-9 lg:px-12 lg:py-11">
          <p className="eyebrow mb-3 text-muted">A place for your plans</p>
          <header className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="font-display text-[38px] leading-tight tracking-[-1.3px] sm:text-[44px]">
                Your rooms<span className="text-accent">.</span>
              </h1>
              <p className="mt-3 text-[13px] text-muted">
                Good spaces start with a little rearranging.
              </p>
            </div>
            <SketchButton
              onClick={handleStartRoom}
              disabled={isCreating}
              primary
            >
              <Icon name="plus" size={16} />
              {isCreating ? "Creating room…" : "New room"}
            </SketchButton>
          </header>
          {createError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            >
              {createError}
            </p>
          )}
          <div className="mb-6 mt-10 flex items-center justify-between gap-3 border-t border-hair pt-6">
            <h2 className="flex items-center gap-2 text-[13px] font-medium">
              <Icon name="grid" size={15} />
              All rooms
              {!isLoading && (
                <span className="ml-1 rounded-md bg-fill-2 px-2 py-0.5 font-mono text-[10px] text-muted">
                  {rooms.length}
                </span>
              )}
            </h2>
            <label className="flex items-center gap-2">
              <span className="sr-only">Sort rooms</span>
              <select
                className="nook-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortByOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {isLoading ? (
            <div
              role="status"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              <span className="sr-only">Loading rooms…</span>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[272px] animate-pulse rounded-xl border border-hair bg-white"
                >
                  <div className="h-[190px] rounded-t-xl bg-fill" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-xl border border-hair bg-white p-8 text-center"
            >
              <p className="mb-5 text-sm text-ink-2">{error}</p>
              <SketchButton onClick={retry}>Try again</SketchButton>
            </div>
          ) : rooms.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {rooms.map((r, i) => (
                <RoomCard
                  key={r.id}
                  id={r.id}
                  name={r.name}
                  index={i}
                  when={
                    r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-xl border border-dashed border-[#bdc8b7] bg-white/50 p-7 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-fill-2 text-accent">
                <Icon name="rooms" size={30} />
              </div>
              <h2 className="font-display text-[28px] tracking-tight">
                A fresh start for your space.
              </h2>
              <p className="mb-6 mt-3 max-w-[280px] text-[13px] leading-relaxed text-muted">
                Create your first room and find an arrangement that feels like
                home.
              </p>
              <SketchButton
                onClick={handleStartRoom}
                disabled={isCreating}
                primary
              >
                <Icon name="plus" size={16} />
                {isCreating ? "Creating room…" : "Create your first room"}
              </SketchButton>
            </div>
          )}
          <p className="mt-8 text-center font-mono text-[9px] uppercase tracking-[.16em] text-muted">
            A little planning. A lot of possibility.
          </p>
        </div>
      </div>
    </main>
  );
}
