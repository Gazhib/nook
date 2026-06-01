import { Room } from "@nook/shared";
import { ApiError, client } from "./client";

interface CreateRoomProps {
  roomId: string;
  message: string;
}

export const createRoomService = async () => {
  const res = await client.post<CreateRoomProps>(`/rooms`); //change this hardcoded
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
