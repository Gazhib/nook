import { RawData, WebSocket } from "ws";
import * as awarenessProtocol from "y-protocols/awareness";
import { Doc } from "yjs";
import { YJSservice } from "../services/YJSservice";

export const YJScontroller = {
  handleMessage(
    message: RawData,
    doc: Doc,
    ws: WebSocket,
    awareness: awarenessProtocol.Awareness
  ) {
    YJSservice.handleMessage(message, doc, ws, awareness);
  },
};
