"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Header } from "@/components/RoomCanvas/ui/Header";
import { ShareModal } from "@/features/Share/ui/ShareModal";
import { getRoomAccessService } from "@/services/roomServices";
import { ApiError } from "@/services/client";
import { useConnectionStore } from "@/stores/useConnectionStore";
import { Role } from "@nook/shared";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";

const RoomCanvas = dynamic(
  () =>
    import("@/components/RoomCanvas/ui/RoomCanvas").then(
      (module) => module.RoomCanvas,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="plan-surface flex flex-1 items-center justify-center text-sm text-muted"
      >
        Opening your studio…
      </div>
    ),
  },
);

export default function Room({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const [open, setOpen] = useState(false);
  const connection = useConnectionStore((state) => state.connection);
  const [access, setAccess] = useState<{
    roomId: string;
    role: Role | null;
    error: string;
    missing: boolean;
  } | null>(null);
  useEffect(() => {
    let active = true;
    getRoomAccessService(roomId)
      .then((role) => {
        if (active) setAccess({ roomId, role, error: "", missing: false });
      })
      .catch((error) => {
        if (active) {
          const denied =
            error instanceof ApiError && [401, 403, 404].includes(error.status);
          setAccess((previous) =>
            previous?.roomId === roomId && previous.role && !denied
              ? previous
              : {
                  roomId,
                  role: null,
                  error:
                    "We couldn't open this room. Please reload to try again.",
                  missing:
                    error instanceof ApiError &&
                    (error.status === 404 || error.status === 403),
                },
          );
        }
      });
    return () => {
      active = false;
    };
  }, [roomId, connection]);
  const currentAccess = access?.roomId === roomId ? access : null;
  if (currentAccess?.missing) notFound();
  if (currentAccess?.error)
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 className="font-display text-3xl">
          Your room could not be opened.
        </h1>
        <p role="alert" className="text-sm text-muted">
          {currentAccess.error}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="nook-button nook-button-primary"
          >
            Try again
          </button>
          <Link href="/rooms" className="nook-button nook-button-secondary">
            Your rooms
          </Link>
        </div>
      </main>
    );
  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-paper">
      <Header
        key={roomId}
        onShare={() => setOpen(true)}
        roomId={roomId}
        role={currentAccess?.role ?? null}
      />
      {currentAccess?.role ? (
        <RoomCanvas key={roomId} roomId={roomId} role={currentAccess.role} />
      ) : (
        <div
          role="status"
          className="plan-surface flex flex-1 items-center justify-center text-sm text-muted"
        >
          Opening your studio…
        </div>
      )}
      <ShareModal
        key={roomId}
        onClose={() => setOpen(false)}
        open={open}
        currentUserRole={currentAccess?.role ?? null}
      />
    </main>
  );
}
