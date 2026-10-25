"use client";

import { SketchButton } from "@/components/Button";
import { Wordmark } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getRoomNameService, renameRoomService } from "@/services/roomServices";
import { Role } from "@nook/shared";
import { useConnectionStore } from "@/stores/useConnectionStore";
import toast from "react-hot-toast";

const connectionMeta: Record<string, { label: string; color: string }> = {
  connected: { label: "Connected", color: "#648565" },
  connecting: { label: "Connecting", color: "#ad8a4b" },
  disconnected: { label: "Offline", color: "#b15a49" },
};

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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const savedName = useRef("");
  const connection = useConnectionStore((state) => state.connection);
  const status = connectionMeta[connection] ?? connectionMeta.connecting;
  useEffect(() => {
    let active = true;
    getRoomNameService(roomId)
      .then((name) => {
        if (!active) return;
        setRoomName(name);
        savedName.current = name;
        setIsLoading(false);
      })
      .catch(() => {
        if (active) toast.error("Couldn't load the room name.");
      });
    return () => {
      active = false;
    };
  }, [roomId]);
  const handleNameSubmit = async () => {
    const name = roomName.trim();
    if (isSaving || name === savedName.current) return;
    if (!name) {
      setRoomName(savedName.current);
      return;
    }
    setRoomName(name);
    setIsSaving(true);
    try {
      await renameRoomService(roomId, name);
      savedName.current = name;
    } catch {
      setRoomName(savedName.current);
      toast.error("Couldn't rename the room. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <header className="z-20 flex h-[72px] shrink-0 items-center gap-3 border-b border-hair bg-[#fcfcf8] px-4 sm:gap-5 sm:px-6">
      <Wordmark onClick={() => router.push("/rooms")} size={21} />
      <div className="h-7 w-px shrink-0 bg-hair" />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          {role === "owner" ? (
            <input
              aria-label="Room name"
              maxLength={255}
              disabled={isLoading || isSaving}
              className="w-full max-w-[300px] rounded border border-transparent bg-transparent py-1 text-[13px] font-medium hover:border-hair focus:border-hair focus:bg-white focus:outline-none sm:text-sm"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onBlur={() => void handleNameSubmit()}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
                if (e.key === "Escape") {
                  setRoomName(savedName.current);
                }
              }}
              placeholder="Loading room…"
            />
          ) : (
            <h1 className="truncate text-[13px] font-medium sm:text-sm">
              {roomName || "Loading room…"}
            </h1>
          )}
        </div>
        <p className="mt-0.5 hidden font-mono text-[9px] uppercase tracking-[.1em] text-muted sm:block">
          {isSaving
            ? "Saving name…"
            : role === "viewer"
              ? "View only"
              : "Your planning studio"}
        </p>
      </div>
      <span
        role="status"
        className="hidden shrink-0 items-center gap-1.5 text-[10px] text-muted sm:flex"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${connection === "connecting" ? "animate-pulse" : ""}`}
          style={{ background: status.color }}
        />
        {status.label}
      </span>
      <SketchButton
        onClick={onShare}
        primary
        className="!min-h-9 !px-3 !py-2 !text-xs"
      >
        <Icon name="share" size={14} />
        <span>Share</span>
      </SketchButton>
    </header>
  );
};
