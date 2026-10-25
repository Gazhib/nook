import { and, desc, eq, inArray, notInArray } from "drizzle-orm";
import { db } from "..";
import { ConflictError, NotFoundError, RoomError } from "../errors";
import { room_snapshots, roomMembers, rooms, users } from "../schemas";
import { Role, Accessibility } from "@nook/shared/index";
/** Postgres unique-violation error code. */
const PG_UNIQUE_VIOLATION = "23505";

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === PG_UNIQUE_VIOLATION
  );
}

type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

const MAX_SNAPSHOTS_PER_ROOM = 10;

export const roomRepository = {
  async createRoom(ownerId: string) {
    const [newRoom] = await db
      .insert(rooms)
      .values({
        ownerId,
      })
      .returning({ id: rooms.id });

    if (!newRoom) throw new RoomError("Could not create a Room");

    return newRoom.id;
  },

  async setRole(userId: string, role: Role, roomId: string) {
    await db.insert(roomMembers).values({ userId, role, roomId });
  },

  async getRoomInfo(roomId: string) {
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room) throw new NotFoundError("Room not found");

    return room;
  },

  async getRoomSnapshot(roomId: string) {
    const [roomSnapshot] = await db
      .select()
      .from(room_snapshots)
      .where(eq(room_snapshots.roomId, roomId))
      .orderBy(desc(room_snapshots.createdAt))
      .limit(1);

    return roomSnapshot;
  },

  async pruneSnapshots(roomId: string, executor: Executor = db) {
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
          notInArray(room_snapshots.id, keepIds),
        ),
      );
  },

  async setRoomSnapshot(roomId: string, state: Buffer) {
    await db.transaction(async (tx) => {
      await tx.insert(room_snapshots).values({ roomId, state });
      await this.pruneSnapshots(roomId, tx);
    });
  },

  async getRoomAccess(roomId: string, userId: string) {
    const member = await db.query.roomMembers.findFirst({
      where: and(
        eq(roomMembers.roomId, roomId),
        eq(roomMembers.userId, userId),
      ),
      columns: { role: true },
    });

    return member?.role ?? null;
  },

  async getRoomAccessibility(roomId: string) {
    const [room] = await db
      .select({ typeOfAccessibility: rooms.typeOfAccessibility })
      .from(rooms)
      .where(eq(rooms.id, roomId));
    return room?.typeOfAccessibility;
  },

  async setRoomAccessibility(roomId: string, accessibility: Accessibility) {
    await db
      .update(rooms)
      .set({ typeOfAccessibility: accessibility })
      .where(eq(rooms.id, roomId));
  },

  async getRoomMembers(roomId: string) {
    const members = await db
      .select()
      .from(roomMembers)
      .where(eq(roomMembers.roomId, roomId));

    const userIds = members.map((m) => m.userId);

    const usersInfo = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(inArray(users.id, userIds));

    return members.map((m) => {
      const userInfo = usersInfo.find((u) => u.id === m.userId);
      return {
        userId: m.userId,
        role: m.role,
        username: userInfo?.username ?? "Unknown",
      };
    });
  },

  async inviteUser(roomId: string, username: string, role: Role) {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    try {
      await db.insert(roomMembers).values({
        userId: user.id,
        role: role.toLocaleLowerCase() as Role,
        roomId,
      });
      return user;
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new ConflictError("User is already a member of this room");
      }
      console.error(err);
      throw new RoomError("Could not invite user to the room");
    }
  },

  async getRoomsForUser(userId: string) {
    const roomsForUser = await db
      .select({
        id: rooms.id,
        ownerId: rooms.ownerId,
        typeOfAccessibility: rooms.typeOfAccessibility,
        name: rooms.name,
        createdAt: rooms.createdAt,
      })
      .from(rooms)
      .innerJoin(roomMembers, eq(rooms.id, roomMembers.roomId))
      .where(eq(roomMembers.userId, userId))
      .orderBy(desc(rooms.createdAt), desc(rooms.id));

    return roomsForUser;
  },

  async renameRoom(roomId: string, newName: string) {
    await db.update(rooms).set({ name: newName }).where(eq(rooms.id, roomId));
  },

  async getRoomName(roomId: string) {
    const [room] = await db
      .select({ name: rooms.name })
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room) throw new NotFoundError("Room not found");

    return room.name;
  },

  async changeRole(roomId: string, userId: string, role: Role) {
    await db
      .update(roomMembers)
      .set({ role: role })
      .where(
        and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)),
      );
  },

  async kickUserFromRoom(roomId: string, userId: string) {
    await db
      .delete(roomMembers)
      .where(
        and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)),
      );
  },
};
