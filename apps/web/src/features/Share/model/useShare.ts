import {
  changeRoomAccessibilityService,
  getRoomMembersService,
  inviteUserToRoomService,
  RoomMember,
} from "@/services/roomServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
      if (res instanceof Array) setMembers(res);
      console.log(res);
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

    inviteUserToRoomService(roomId.toString(), username, role);
  };

  const handleChangeVisibility = () => {
    if (roomId) changeRoomAccessibilityService(roomId.toString());
    setVisibility((prev) => (prev === "private" ? "public" : "private"));
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
  };
};
