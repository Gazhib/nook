import { ApiError } from "@/services/client";
import { getRoomStateService } from "@/services/roomServices";
import { useConnectionStore } from "@/stores/useConnectionStore";
import { FurnitureItem, UsersAwareness } from "@nook/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { Awareness } from "y-protocols/awareness";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

const pendingDisposals = new WeakMap<Y.Doc, ReturnType<typeof setTimeout>>();

const getWebsocketUrl = () => {
  const url = new URL(
    process.env.NEXT_PUBLIC_WS_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      window.location.origin,
    window.location.origin,
  );
  url.protocol =
    url.protocol === "https:" || url.protocol === "wss:" ? "wss:" : "ws:";
  return url.toString().replace(/\/$/, "");
};

export const useYjsRoom = ({ roomId }: { roomId: string }) => {
  const ydoc = useMemo(() => new Y.Doc({ guid: roomId }), [roomId]);
  const yFurniture = useMemo(
    () => ydoc.getMap<FurnitureItem>("furniture"),
    [ydoc],
  );
  const [missingRoomId, setMissingRoomId] = useState<string | null>(null);
  const [presence, setPresence] = useState<{
    doc: Y.Doc;
    users: UsersAwareness[];
  }>(() => ({
    doc: ydoc,
    users: [],
  }));
  const awarenessRef = useRef<Awareness | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const connection = useConnectionStore((state) => state.connection);
  const setConnection = useConnectionStore((state) => state.setConnection);

  useEffect(() => {
    // Strict Mode immediately reconnects the same document after effect cleanup.
    // Defer disposal so that reconnect can cancel it; another room gets its own doc.
    const pending = pendingDisposals.get(ydoc);
    if (pending) clearTimeout(pending);
    pendingDisposals.delete(ydoc);
    return () => {
      const timer = setTimeout(() => {
        pendingDisposals.delete(ydoc);
        ydoc.destroy();
      }, 0);
      pendingDisposals.set(ydoc, timer);
    };
  }, [ydoc]);

  useEffect(() => {
    const persistence = new IndexeddbPersistence(roomId, ydoc);
    void persistence.whenSynced.catch((error: unknown) => {
      console.error("Unable to load the local room cache:", error);
    });
    return () => {
      void persistence.destroy();
    };
  }, [roomId, ydoc]);

  useEffect(() => {
    let active = true;
    const getRoomState = async () => {
      try {
        const res = await getRoomStateService(roomId);
        if (!active) return;
        if (res?.roomSnapshot?.state) {
          Y.applyUpdate(ydoc, new Uint8Array(res.roomSnapshot.state.data));
        }
        setMissingRoomId(null);
      } catch (error) {
        if (!active) return;
        if (error instanceof ApiError && error.status === 404) {
          setMissingRoomId(roomId);
          return;
        }
        console.error("Unable to load the saved room:", error);
      }
    };
    void getRoomState();
    return () => {
      active = false;
    };
  }, [roomId, ydoc]);

  useEffect(() => {
    const provider = new WebsocketProvider(getWebsocketUrl(), roomId, ydoc, {
      disableBc: true,
    });
    providerRef.current = provider;
    const awareness = provider.awareness;
    awarenessRef.current = awareness;
    const onStatus = ({
      status,
    }: {
      status: "connecting" | "connected" | "disconnected";
    }) => {
      setConnection(status);
    };
    const onAwarenessChange = () => {
      const states = Array.from(awareness.getStates().entries())
        .filter(
          ([clientId, state]) =>
            clientId !== awareness.clientID && state.user?.mousePos,
        )
        .map(([clientId, state]) => ({
          clientId,
          ...state,
        })) as UsersAwareness[];
      setPresence({ doc: ydoc, users: states });
    };
    provider.on("status", onStatus);
    awareness.on("change", onAwarenessChange);
    setConnection("connecting");
    return () => {
      provider.off("status", onStatus);
      awareness.off("change", onAwarenessChange);
      if (awarenessRef.current === awareness) awarenessRef.current = null;
      if (providerRef.current === provider) providerRef.current = null;
      provider.destroy();
    };
  }, [roomId, ydoc, setConnection]);

  const toggleWebsocket = () => {
    const provider = providerRef.current;
    if (!provider) return;
    if (provider.shouldConnect) provider.disconnect();
    else provider.connect();
  };

  return {
    ydoc,
    yFurniture,
    awarenessRef,
    users: presence.doc === ydoc ? presence.users : [],
    isRoomMissing: missingRoomId === roomId,
    toggleWebsocket,
    connection,
  };
};
