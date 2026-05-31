import { and, desc, eq, notInArray } from "drizzle-orm";
import { db } from "..";
import { RoomError } from "../errors";
import { room_snapshots, rooms } from "../schemas";

type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

const MAX_SNAPSHOTS_PER_ROOM = 10;

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

  async getRoomInfo(roomId: number) {
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room) throw new RoomError("Could not find a Room");

    return room;
  },

  async getRoomSnapshot(roomId: number) {
    const [roomSnapshot] = await db
      .select()
      .from(room_snapshots)
      .where(eq(room_snapshots.roomId, roomId))
      .orderBy(desc(room_snapshots.createdAt))
      .limit(1);

    return roomSnapshot;
  },

  async pruneSnapshots(roomId: number, executor: Executor = db) {
    const keep = await executor
      .select({ id: room_snapshots.id })
      .from(room_snapshots)
      .where(eq(room_snapshots.roomId, roomId))
      .orderBy(desc(room_snapshots.createdAt))
      .limit(MAX_SNAPSHOTS_PER_ROOM);

    const keepIds = keep.map((r) => r.id);

    await executor
      .delete(room_snapshots)
      .where(
        and(
          eq(room_snapshots.roomId, roomId),
          notInArray(room_snapshots.id, keepIds)
        )
      );
  },

  async setRoomSnapshot(roomId: number, state: Buffer) {
    await db.transaction(async (tx) => {
      await tx.insert(room_snapshots).values({ roomId, state });
      await this.pruneSnapshots(roomId, tx);
    });
  },
};
