import { ApiError } from "@/services/client";
import {
  getRoomStateService,
  saveRoomStateService,
} from "@/services/roomServices";
import { FurnitureItem, UsersAwareness } from "@nook/shared";
import { useEffect, useRef, useState } from "react";

import { Awareness } from "y-protocols/awareness";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export const useYjsRoom = ({ roomId }: { roomId: string }) => {
  const [ydoc] = useState(() => new Y.Doc());
  const [yFurniture] = useState(() => ydoc.getMap<FurnitureItem>("furniture"));
  const [isRoomMissing, setIsRoomMissing] = useState(false);

  const [users, setUsers] = useState<UsersAwareness[]>([]);

  const awarenessRef = useRef<Awareness | null>(null);

  const saveNewSnapshot = (roomId: string) => {
    saveRoomStateService(roomId, Buffer.from(Y.encodeStateAsUpdate(ydoc)));
  };

  useEffect(() => {
    const getRoomState = async () => {
      try {
        const res = await getRoomStateService(roomId);

        if (res?.roomSnapshot.state) {
          const neededState = new Uint8Array(res.roomSnapshot.state.data);

          Y.applyUpdate(ydoc, neededState);
          setIsRoomMissing(false);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setIsRoomMissing(true);
          return;
        }
        throw err;
      }
    };

    getRoomState();
  }, [roomId]);

  useEffect(() => {
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      roomId.toString(),
      ydoc
    );

    const awareness = provider.awareness;

    awareness.on("change", (_changes: any) => {
      const states = Array.from(awareness.getStates().entries())
        .filter(([clientId]) => clientId !== awareness.clientID)
        .map(([clientId, state]) => ({
          clientId,
          ...state,
        })) as UsersAwareness[];
      setUsers(states);
    });

    awarenessRef.current = awareness;

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  return {
    ydoc,
    yFurniture,
    awarenessRef,
    users,
    saveNewSnapshot,
    isRoomMissing,
  };
};
