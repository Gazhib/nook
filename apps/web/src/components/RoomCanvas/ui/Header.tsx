"use client";

import { SketchButton } from "@/components/Button";
import { Wordmark } from "@/components/Logo";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { client } from "@/services/client";
import { getRoomNameService } from "@/services/roomServices";
import { Role } from "@nook/shared";
import { useConnectionStore } from "@/stores/useConnectionStore";

export const Header = ({
  onShare,
  roomId,
  role,
}: {
  onShare: () => void;
  roomId: string;
  role: Role | null;
}) => {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");

  const bouncingRef = useRef<NodeJS.Timeout | null>(null);

  const connection = useConnectionStore((state) => state.connection);

  const connectionMeta: Record<string, { label: string; color: string }> = {
    connected: { label: "Connected", color: "#7A8F6B" },
    connecting: { label: "Connecting", color: "#C4A97D" },
    disconnected: { label: "Offline", color: "#B8563E" },
  };
  const status = connectionMeta[connection] ?? connectionMeta.connecting;

  useEffect(() => {
    const fetchRoomName = async () => {
      const res = await getRoomNameService(roomId);
      console.log(res);
      setRoomName(res);
    };
    fetchRoomName();
  }, [roomId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (bouncingRef.current) clearTimeout(bouncingRef.current);

    setRoomName(e.target.value);
  };

  const handleNameSubmit = async () => {
    if (bouncingRef.current) clearTimeout(bouncingRef.current);

    bouncingRef.current = setTimeout(() => {
      bouncingRef.current = null;
      client.post(`/rooms/${roomId}/rename`, { newName: roomName });
    }, 2000);
  };

  const onFocus = () => {
    if (bouncingRef.current) {
      clearTimeout(bouncingRef.current);
      bouncingRef.current = null;
    }
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-hair bg-white px-4 max-w-screen">
      <Wordmark onClick={() => router.push("/")} size={18} />
      <div className="h-5 w-px bg-hair" />
      <div className="flex items-center gap-1.5 font-display text-sm font-medium text-ink">
        {role === "viewer" ? (
          <span className="bg-transparent focus:outline-none">{roomName}</span>
        ) : (
          <input
            className="bg-transparent focus:outline-none"
            onFocus={onFocus}
            onBlur={handleNameSubmit}
            value={roomName}
            onChange={handleNameChange}
          />
        )}

        <span className="rounded-[3px] border border-hair px-[5px] py-0.5 font-mono text-[10px] text-muted">
          room/{roomId}
        </span>
      </div>
      <div className="flex-1" />
      <div
        className="mr-2 flex items-center gap-1.5 rounded-full border border-hair px-2.5 py-1 font-display text-xs font-medium text-muted"
        title={status.label}
        aria-live="polite"
      >
        <span
          className={`h-2 w-2 rounded-full ${
            connection === "connecting" ? "animate-pulse" : ""
          }`}
          style={{ backgroundColor: status.color }}
          aria-hidden="true"
        />
        {status.label}
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

        <span className="ml-1.5">Share</span>
      </SketchButton>
      {/* <SketchAvatar size={26} label="Y" /> */}
    </header>
  );
};
