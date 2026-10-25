import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Role } from "@nook/shared";
import {
  changeRoomAccessibilityService,
  changeUserRoleService,
  getRoomMembersService,
  getRoomStateService,
  inviteUserToRoomService,
  kickUserService,
  RoomMember,
} from "@/services/roomServices";

export const useShare = (open: boolean, currentUserRole: Role | null) => {
  const { roomId } = useParams<{ roomId: string }>();
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const canManage = currentUserRole === "owner";

  useEffect(() => {
    if (!open || !roomId) return;
    let active = true;
    const load = async () => {
      try {
        const [state, roomMembers] = await Promise.all([
          getRoomStateService(roomId),
          getRoomMembersService(roomId),
        ]);
        if (!active) return;
        setVisibility(state.room.typeOfAccessibility);
        setMembers(roomMembers);
        setLink(`${window.location.origin}/rooms/${roomId}`);
        setError("");
      } catch {
        if (active)
          setError(
            "We couldn't load sharing settings. Close this window and try again.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [roomId, open]);

  const run = async (action: () => Promise<void>) => {
    if (!canManage || pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    try {
      await action();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "That change couldn't be saved. Please try again.",
      );
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Room link copied.");
    } catch {
      toast.error("Couldn't copy the link. You can select and copy it above.");
    }
  };
  const handleInvite = () =>
    run(async () => {
      const name = username.trim();
      if (!name) return;
      const res = await inviteUserToRoomService(roomId, name, role);
      setMembers((prev) => [
        ...prev.filter((member) => member.userId !== res.user.id),
        { userId: res.user.id, username: name, role, changeAble: true },
      ]);
      setUsername("");
      toast.success("Invitation sent.");
    });
  const handleChangeVisibility = (next: "private" | "public") => {
    if (next === visibility) return;
    return run(async () => {
      await changeRoomAccessibilityService(roomId, next);
      setVisibility(next);
      toast.success(
        next === "public" ? "Link sharing is on." : "Room is now private.",
      );
    });
  };
  const handleChangeRole = (userId: string, nextRole: Role) =>
    run(async () => {
      await changeUserRoleService(roomId, userId, nextRole);
      setMembers((prev) =>
        prev.map((member) =>
          member.userId === userId ? { ...member, role: nextRole } : member,
        ),
      );
      toast.success("Access updated.");
    });
  const handleRemove = (userId: string) =>
    run(async () => {
      await kickUserService(roomId, userId);
      setMembers((prev) => prev.filter((member) => member.userId !== userId));
      toast.success("Member removed.");
    });
  return {
    visibility,
    isPublic: visibility === "public",
    handleChangeVisibility,
    link,
    handleCopy,
    username,
    setUsername,
    role,
    setRole,
    members,
    handleInvite,
    handleChangeRole,
    handleRemove,
    canManage,
    pending,
    isLoading,
    error,
  };
};
