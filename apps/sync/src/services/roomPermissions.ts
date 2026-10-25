import type { Accessibility, Role } from "@nook/shared";
import { ForbiddenError, NotFoundError } from "../errors";

export function resolveRoomRole(
  membership: Role | null,
  accessibility: Accessibility | undefined,
): Role {
  if (!accessibility) throw new NotFoundError("Room not found");
  if (membership) return membership;
  if (accessibility === "public") return "editor";
  throw new NotFoundError("You have no access to the room");
}

export function assertRoomEditor(role: Role) {
  if (role === "viewer") throw new ForbiddenError("You cannot edit this room");
}

export function assertRoomOwner(role: Role) {
  if (role !== "owner") {
    throw new ForbiddenError("Only the owner can manage room sharing");
  }
}
