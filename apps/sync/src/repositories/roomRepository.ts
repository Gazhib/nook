import { db } from "..";
import { RoomError } from "../errors";
import { rooms } from "../schemas";

export const roomRepository = {
  async createRoom(ownerId: number) {
    const [newRoom] = await db
      .insert(rooms)
      .values({
        ownerId,
      })
      .returning({ id: rooms.id });

    if (!newRoom) throw new RoomError("Could not create a Room");

    return newRoom.id;
  },
};
