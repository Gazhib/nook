import { Room } from "@nook/shared";
import { ApiError, client } from "./client";

interface CreateRoomProps {
  roomId: string;
  message: string;
}

export const createRoomService = async () => {
  const res = await client.post<CreateRoomProps>(`/rooms`);
  return res.roomId;
};

type RoomSnapshot = {
  createdAt: string;
  id: number;
  roomId: string;
  state: {
    data: number[];
    type: string;
  };
};

interface GetRoomProps {
  message: string;
  room: Room;
  roomSnapshot: RoomSnapshot;
}
// Dont forget to handle errors
export const getRoomStateService = async (roomId: string) => {
  try {
    const res = await client.get<GetRoomProps>(`/rooms/${roomId}`);

    return res;
  } catch (err) {
    throw err;
  }
};

export const saveRoomStateService = async (roomId: string, state: Buffer) => {
  await client.post("/rooms/room_snapshot", {
    roomId,
    state: state.toString("base64"),
  });
};

export type RoomRole = "owner" | "editor" | "viewer";

export interface RoomMember {
  userId: string;
  role: RoomRole;
  username: string;
}

interface GetRoomMembersProps {
  members: RoomMember[];
  message: string;
}

export const getRoomMembersService = async (
  roomId: string
): Promise<RoomMember[]> => {
  const res = await client.get<GetRoomMembersProps>(
    `/rooms/${roomId}/room_members`
  );
  return res.members;
};

export const inviteUserToRoomService = async (
  roomId: string,
  username: string,
  role: string
) => {
  await client.post(`/rooms/${roomId}/${username}/invite`, {
    role,
  });
};
export const changeRoomAccessibilityService = async (roomId: string) => {
  await client.get(`/rooms/${roomId}/accessibility`);
};

export const getRoomAccessService = async (roomId: string) => {
  const res = await client.get<{ role: RoomRole; message: string }>(
    `/rooms/${roomId}/access`
  );
  return res.role;
};

export const getRoomsForUserService = async () => {
  const res = await client.get<{ rooms: Room[]; message: string }>(`/rooms`);
  return res.rooms;
};

export const renameRoomService = async (roomId: string, newName: string) => {
  await client.post(`/rooms/${roomId}/rename`, {
    newName,
  });
};

export const getRoomNameService = async (roomId: string) => {
  const res = await client.get<{ name: string; message: string }>(
    `/rooms/${roomId}/name`
  );
  return res.name;
};
