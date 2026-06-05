import { create } from "zustand";

export const useConnectionStore = create<{
  connection: string;
  setConnection: (connection: string) => void;
}>((set) => ({
  connection: "connecting",
  setConnection: (connection) => set({ connection }),
}));
