"use client";

import { SketchButton } from "@/components/Button";
import { ShutDoor } from "@/components/ShutDoor";
import { createRoomService } from "@/services/roomServices";
import { useParams, useRouter } from "next/navigation";

function TriedURL({ id = "apt-3QX7?", big = false }) {
  return (
    <div
      className={`inline-flex items-center gap-px font-mono border border-[var(--color-hair)] rounded-md bg-[var(--color-paper)] text-[var(--color-muted)] ${
        big ? "text-[13px] px-3 py-[9px]" : "text-[12px] px-[10px] py-[7px]"
      }`}
    >
      <span>nook.app/room/</span>
      <span
        style={{
          color: "var(--color-accent)",
          textDecoration: "underline",
          textDecorationStyle: "wavy",
          textDecorationColor: "rgba(184,86,62,0.5)",
          textUnderlineOffset: 3,
        }}
      >
        {id}
      </span>
    </div>
  );
}

export default function RoomNotFound() {
  const router = useRouter();

  const handleStartRoom = async () => {
    const roomId = await createRoomService();
    router.push(`/room/${roomId}`);
  };

  const handleGoToRooms = () => {
    router.push("/");
  };

  const { roomId } = useParams();

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex items-center justify-center rounded-[22px] border border-dashed border-[var(--color-hair)] bg-[var(--color-paper)]"
          style={{ width: 132, height: 132 }}
        >
          <ShutDoor />
        </div>

        <div className="font-display mt-3">
          <h1 className="text-[30px] text-[var(--color-ink)] line-height-[1.55]">
            We could not find that room.
          </h1>
          <h3 className="mt-3 font-body text-[14px] text-[var(--color-ink-2)]">
            The link may be broken, or the room was deleted by its owner
          </h3>
        </div>

        <TriedURL id={roomId?.toString()} />

        <div className="mt-3 inline-flex gap-[10px]">
          <SketchButton primary className="px-4 py-3">
            <button
              className="h-full w-full cursor-pointer"
              onClick={handleGoToRooms}
            >
              Go to your rooms
            </button>
          </SketchButton>
          <SketchButton ghost className="px-4 py-3">
            <button
              className="h-full w-full cursor-pointer"
              onClick={handleStartRoom}
            >
              Create a new room
            </button>
          </SketchButton>
        </div>
      </div>
    </main>
  );
}
