import assert from "node:assert/strict";
import test from "node:test";
import { ForbiddenError, NotFoundError } from "../errors";
import {
  assertRoomEditor,
  assertRoomOwner,
  resolveRoomRole,
} from "./roomPermissions";

test("private rooms deny nonmembers and missing rooms deny all callers", () => {
  assert.throws(() => resolveRoomRole(null, "private"), NotFoundError);
  assert.throws(() => resolveRoomRole(null, undefined), NotFoundError);
  assert.throws(() => resolveRoomRole("owner", undefined), NotFoundError);
});

test("public visitors can edit while explicit viewer membership stays read only", () => {
  assert.equal(resolveRoomRole(null, "public"), "editor");
  assert.equal(resolveRoomRole("viewer", "public"), "viewer");
  assert.equal(resolveRoomRole("owner", "private"), "owner");
  assert.equal(resolveRoomRole("editor", "private"), "editor");
});

test("viewers cannot save snapshots and editors cannot manage sharing", () => {
  assert.throws(() => assertRoomEditor("viewer"), ForbiddenError);
  assert.doesNotThrow(() => assertRoomEditor("editor"));
  assert.doesNotThrow(() => assertRoomEditor("owner"));
  assert.throws(() => assertRoomOwner("viewer"), ForbiddenError);
  assert.throws(() => assertRoomOwner("editor"), ForbiddenError);
  assert.doesNotThrow(() => assertRoomOwner("owner"));
});
