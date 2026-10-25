"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getRoomsForUserService } from "@/services/roomServices";
import { Room } from "@nook/shared";

const sortByOptions = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
];

export const useMyRooms = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [allRooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const loadRooms = useCallback((signal?: AbortSignal) => {
    return getRoomsForUserService(signal)
      .then((rooms) => {
        if (!signal?.aborted) {
          setRooms(rooms);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!signal?.aborted) {
          setError("We couldn't load your rooms. Please try again.");
          setIsLoading(false);
        }
      });
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    void loadRooms(controller.signal);
    return () => controller.abort();
  }, [loadRooms]);
  const rooms = useMemo(
    () =>
      [...allRooms].sort((a, b) => {
        const difference =
          (Date.parse(a.createdAt ?? "") || 0) -
          (Date.parse(b.createdAt ?? "") || 0);
        const order = difference || a.id.localeCompare(b.id);
        return sortBy === "newest" ? -order : order;
      }),
    [allRooms, sortBy],
  );
  return {
    sortBy,
    setSortBy,
    sortByOptions,
    rooms,
    isLoading,
    error,
    retry: () => {
      setIsLoading(true);
      setError("");
      void loadRooms();
    },
  };
};
