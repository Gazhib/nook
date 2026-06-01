import {
  pgTable,
  serial,
  timestamp,
  integer,
  customType,
  primaryKey,
  pgEnum,
  varchar,
  uuid,
  text,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["editor", "owner", "viewer"]);

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 24 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  email: text("email").notNull(),
  avatarURL: text("avatar_url"),
  password: text("password").notNull(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const room_snapshots = pgTable("room_snapshots", {
  id: serial("id").primaryKey(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id),
  state: bytea("state").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomMembers = pgTable(
  "room_members",
  {
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: roleEnum().default("viewer"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roomId, t.userId] }),
  })
);
