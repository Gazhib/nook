"use client";

import { SketchButton } from "@/components/Button";
import { useMyRooms } from "@/components/Rooms/model/useMyRooms";
import { RoomCard } from "@/components/Rooms/ui/RoomCard";
import { RoomsHeader } from "@/components/Rooms/ui/RoomsHeader";
import { RoomsSidebar } from "@/components/Rooms/ui/RoomsSidebar";
import { createRoomService } from "@/services/roomServices";
import { Select } from "antd";
import { useRouter } from "next/navigation";

export default function Rooms() {
  const { setSortBy, sortBy, sortByOptions, rooms } = useMyRooms();

  const router = useRouter();
  const handleStartRoom = async () => {
    const roomId = await createRoomService();
    router.push(`/rooms/${roomId}`);
  };

  return (
    <main className="flex h-full w-full flex-col bg-paper">
      <RoomsHeader />
      <div className="flex min-h-0 flex-1">
        <RoomsSidebar />
        <div className="flex-1 overflow-auto px-10 py-8">
          <header className="mb-6 flex items-center justify-between">
            <div className="font-display text-[22px] font-medium text-ink">
              All rooms{" "}
              <span className="ml-1.5 text-base font-normal text-muted">
                {rooms.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Select
                options={sortByOptions}
                value={sortBy}
                onChange={(v) => setSortBy(v)}
                className="text-[12px] text-muted"
              />
              <SketchButton
                onClick={handleStartRoom}
                primary
                className="px-3.5 py-[7px] text-[12px]"
              >
                + New
              </SketchButton>
            </div>
          </header>

          <div className="grid grid-cols-4 gap-[14px]">
            {rooms.map((r, i) => (
              <RoomCard
                onClick={() => router.push(`/rooms/${r.id}`)}
                key={r.id}
                id={r.id}
                name={r.name}
                compact
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
