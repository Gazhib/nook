import {
  changeRoomAccessibilityService,
  changeUserRoleService,
  getRoomMembersService,
  inviteUserToRoomService,
  kickUserService,
  RoomMember,
} from "@/services/roomServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Role } from "@nook/shared";

export const useShare = () => {
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const isPublic = visibility === "public";

  const { roomId } = useParams();
  const [link, setLink] = useState("");

  useEffect(() => {
    setLink(`${window.location.origin}/rooms/${roomId}`);
  }, [roomId]);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Editor");

  const [members, setMembers] = useState<RoomMember[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const getRoomMembers = async () => {
      const res = await getRoomMembersService(roomId.toString());
      if (res instanceof Array)
        setMembers(res.map((m) => ({ ...m, changeAble: m.role !== "owner" })));
    };
    getRoomMembers();
  }, [roomId]);

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!", {
      duration: 2000,
    });
  };

  const handleInvite = async () => {
    if (!roomId) return;

    const res = await inviteUserToRoomService(
      roomId.toString(),
      username,
      role
    );

    if (res instanceof Error) {
      toast.error(res.message, {
        duration: 2000,
      });
    } else {
      toast.success("User invited successfully!", {
        duration: 2000,
      });
      console.log(res.user.id);
      setMembers((prev) => [
        ...prev,
        { userId: res.user.id, username, role: role as Role, changeAble: true },
      ]);
      setUsername("");
    }
  };

  const handleChangeVisibility = () => {
    if (roomId) {
      if (visibility === "private") {
        toast.success("Room is now public!", {
          duration: 2000,
        });
        changeRoomAccessibilityService(
          roomId.toString(),
          visibility === "private" ? "public" : "private"
        );
      } else {
        toast.success("Room is now private!", {
          duration: 2000,
        });
        changeRoomAccessibilityService(
          roomId.toString(),
          visibility === "public" ? "private" : "public"
        );
      }
    }

    setVisibility((prev) => (prev === "private" ? "public" : "private"));
  };

  const handleChangeRole = async (userId: string, role: Role) => {
    if (!roomId) return;
    await changeUserRoleService(roomId?.toString(), userId, role);

    if (role !== "owner" && role !== "editor" && role !== "viewer") return;

    setMembers((prev) =>
      prev.map((member) =>
        member.userId === userId ? { ...member, role: role } : member
      )
    );
  };

  const handleRemove = async (userId: string) => {
    if (!roomId) return;

    await kickUserService(roomId.toString(), userId);
    setMembers((prev) => prev.filter((member) => member.userId !== userId));
  };

  return {
    visibility,
    handleChangeVisibility,
    isPublic,
    link,
    handleCopy,
    handleUsername,
    username,
    role,
    setRole,
    members,
    handleInvite,
    handleChangeRole,
    handleRemove,
  };
};
