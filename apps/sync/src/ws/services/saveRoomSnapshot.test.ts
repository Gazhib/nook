import assert from "node:assert/strict";
import test from "node:test";
import { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";
import type { WsRoom } from "../model/wsRoomModel";
import { saveDirtyRoom } from "./saveRoomSnapshot";

function createRoom(): WsRoom {
  const doc = new Y.Doc();
  const room: WsRoom = {
    doc,
    awareness: new Awareness(doc),
    conns: new Set(),
    dirty: false,
    saving: false,
  };
  doc.on("update", () => {
    room.dirty = true;
  });
  return room;
}

test("edits arriving during snapshot persistence stay dirty for the next save", async () => {
  const room = createRoom();
  const saved: Buffer[] = [];
  let finish!: () => void;
  const databaseWrite = new Promise<void>((resolve) => {
    finish = resolve;
  });
  try {
    room.doc.getMap("furniture").set("chair", "before");
    const saving = saveDirtyRoom(room, async (state) => {
      saved.push(state);
      await databaseWrite;
    });
    assert.equal(room.saving, true);
    room.doc.getMap("furniture").set("chair", "during");
    // Concurrent save attempts must not overwrite the in-flight snapshot.
    await saveDirtyRoom(room, async () => {
      assert.fail("A save is already active");
    });
    finish();
    await saving;
    assert.equal(room.dirty, true);
    await saveDirtyRoom(room, async (state) => {
      saved.push(state);
    });
    assert.equal(room.dirty, false);
    assert.equal(room.saving, false);
    assert.equal(saved.length, 2);
    const persisted = new Y.Doc();
    try {
      assert.ok(saved[1]);
      Y.applyUpdate(persisted, saved[1]);
      assert.equal(persisted.getMap("furniture").get("chair"), "during");
    } finally {
      persisted.destroy();
    }
  } finally {
    room.awareness.destroy();
    room.doc.destroy();
  }
});

test("failed snapshot writes restore dirty state so they can be retried", async () => {
  const room = createRoom();
  try {
    room.doc.getMap("furniture").set("chair", "saved later");
    await assert.rejects(
      saveDirtyRoom(room, async () => {
        throw new Error("Database unavailable");
      }),
    );
    assert.equal(room.dirty, true);
    assert.equal(room.saving, false);
    await saveDirtyRoom(room, async () => {});
    assert.equal(room.dirty, false);
  } finally {
    room.awareness.destroy();
    room.doc.destroy();
  }
});
