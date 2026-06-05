import { ApiError } from "@/services/client";
import {
  getRoomStateService,
  saveRoomStateService,
} from "@/services/roomServices";
import { useConnectionStore } from "@/stores/useConnectionStore";
import { FurnitureItem, Room, UsersAwareness } from "@nook/shared";
import { useEffect, useRef, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";

import { Awareness } from "y-protocols/awareness";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export const useYjsRoom = ({ roomId }: { roomId: string }) => {
  const [ydoc] = useState(() => new Y.Doc());

  const [yFurniture] = useState(() => ydoc.getMap<FurnitureItem>("furniture"));
  const [isRoomMissing, setIsRoomMissing] = useState(false);

  const [users, setUsers] = useState<UsersAwareness[]>([]);

  const awarenessRef = useRef<Awareness | null>(null);

  const connection = useConnectionStore((state) => state.connection);
  const setConnection = useConnectionStore((state) => state.setConnection);

  const saveNewSnapshot = (roomId: string) => {
    saveRoomStateService(roomId, Buffer.from(Y.encodeStateAsUpdate(ydoc)));
  };

  useEffect(() => {
    const p = new IndexeddbPersistence(roomId, ydoc);

    p.whenSynced.then(() => {
      console.log("Loaded data from IndexedDB");
    });

    return () => {
      p.destroy();
    };
  }, [roomId, ydoc]);

  useEffect(() => {
    const getRoomState = async () => {
      try {
        const res = await getRoomStateService(roomId);

        if (res?.roomSnapshot && res?.roomSnapshot.state) {
          const neededState = new Uint8Array(res.roomSnapshot.state.data);

          Y.applyUpdate(ydoc, neededState);
          console.log("Applied room snapshot length", neededState.length);
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

  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      roomId.toString(),
      ydoc,
      {
        disableBc: true,
      }
    );

    providerRef.current = provider;

    const awareness = provider.awareness;

    const onStatus = ({
      status,
    }: {
      status: "connecting" | "connected" | "disconnected";
    }) => {
      setConnection(status);
    };

    provider.on("status", onStatus);

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

  const toggleWebsocket = () => {
    if (providerRef.current) {
      if (providerRef.current.wsconnected) {
        providerRef.current.disconnect();
      } else {
        providerRef.current.connect();
      }
    }
  };

  return {
    ydoc,
    yFurniture,
    awarenessRef,
    users,
    saveNewSnapshot,
    isRoomMissing,
    toggleWebsocket,
    connection,
  };
};
