import WebSocket from "ws";
import { Awareness } from "y-protocols/awareness.js";
import { Doc } from "yjs";

export type WsRoom = {
  doc: Doc;
  conns: Set<WebSocket>;
  awareness: Awareness;
  saveInterval?: NodeJS.Timeout;
  emptyTimer?: NodeJS.Timeout;
  dirty: boolean;
  saving: boolean;
};
