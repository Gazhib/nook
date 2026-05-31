import { Room } from "@nook/shared";
import { client } from "./client";

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
  roomId: number;
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

export const getRoomStateService = async (roomId: number) => {
  const res = await client.get<GetRoomProps>(`/rooms/${roomId}`);

  console.log(res);

  return res;
};

export const saveRoomStateService = async (roomId: number, state: Buffer) => {
  await client.post("/rooms/room_snapshot", {
    roomId,
    state: state.toString("base64"),
  });
};
