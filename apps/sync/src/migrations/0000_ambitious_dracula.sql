CREATE TYPE "public"."type_of_accessibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('editor', 'owner', 'viewer');--> statement-breakpoint
CREATE TABLE "room_members" (
	"room_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "role" DEFAULT 'viewer',
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "room_members_room_id_user_id_pk" PRIMARY KEY("room_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "room_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" uuid NOT NULL,
	"state" "bytea" NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"typeOfAccessibility" "type_of_accessibility" DEFAULT 'private' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(24) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"email" text NOT NULL,
	"avatar_url" text,
	"password" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_snapshots" ADD CONSTRAINT "room_snapshots_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;