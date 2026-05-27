import {
  pgTable,
  serial,
  timestamp,
  integer,
  customType,
  primaryKey,
  pgEnum,
  varchar
} from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["editor", "owner", "viewer"])

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", {length: 24}).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const room_snapshots = pgTable("room_snapshots", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id")
    .notNull()
    .references(() => rooms.id),
  state: bytea("state").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomMembers = pgTable(
  "room_members",
  {
    roomId: integer("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: roleEnum().default("viewer"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roomId, t.userId] }),
  })
);
