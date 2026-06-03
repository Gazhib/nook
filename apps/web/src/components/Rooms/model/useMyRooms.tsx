import { getRoomsForUserService } from "@/services/roomServices";
import { Room } from "@nook/shared";
import { useEffect, useState } from "react";

const sortByOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];
export const useMyRooms = () => {
  const [sortBy, setSortBy] = useState(sortByOptions[0].value);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRoomsForUserService();
        console.log(res);
        setRooms(res);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  return {
    sortBy,
    setSortBy,
    sortByOptions,
    rooms,
  };
};
