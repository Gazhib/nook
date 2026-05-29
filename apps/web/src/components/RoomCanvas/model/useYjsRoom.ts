import {
  getRoomStateService,
  saveRoomStateService,
} from "@/services/roomServices";
import { FurnitureItem, UsersAwareness } from "@nook/shared";
import { useEffect, useRef, useState } from "react";

import { Awareness } from "y-protocols/awareness";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export const useYjsRoom = ({ roomId }: { roomId: number }) => {
  const [ydoc] = useState(() => new Y.Doc());
  const [yFurniture] = useState(() => ydoc.getMap<FurnitureItem>("furniture"));

  const [users, setUsers] = useState<UsersAwareness[]>([]);

  const awarenessRef = useRef<Awareness | null>(null);

  const saveNewSnapshot = (roomId: number) => {
    saveRoomStateService(roomId, Buffer.from(Y.encodeStateAsUpdate(ydoc)));
  };

  useEffect(() => {
    const getRoomState = async () => {
      const res = await getRoomStateService(roomId);

      const neededState = new Uint8Array(res.roomSnapshot.state.data);


      if (res?.roomSnapshot.state) Y.applyUpdate(ydoc, neededState);
    };

    getRoomState();
  }, [roomId]);

  useEffect(() => {
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      "room_name",
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
  };
};
