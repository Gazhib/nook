"use client";

import { Header } from "@/components/RoomCanvas/ui/Header";
import { RoomCanvas } from "@/components/RoomCanvas/ui/RoomCanvas";
import { ShareModal } from "@/features/Share/ui/ShareModal";
import { getRoomAccessService } from "@/services/roomServices";
import { Role } from "@nook/shared";
import { use, useEffect, useState } from "react";

export default function Room({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const [open, setOpen] = useState(false);

  const [userRole, setUserRole] = useState<Role | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      const role = await getRoomAccessService(roomId);

      setUserRole(role);
    }

    fetchUserRole();
  }, [roomId]);

  return (
    <main className="bg-paper box-border flex h-screen w-screen flex-col overflow-y-hidden">
      <Header
        onShare={() => {
          setOpen(true);
        }}
        roomId={roomId}
        role={userRole}
      />
      <RoomCanvas roomId={roomId} role={userRole} />
      <ShareModal
        onClose={() => setOpen(false)}
        open={open}
        currentUserRole={userRole}
      />
    </main>
  );
}
