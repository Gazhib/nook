export interface Vec2 {
  x: number;
  y: number;
}

export interface FurnitureItem {
  id: string;
  type: string;
  position: Vec2;
  rotation: number;
  width: number;
  height: number;
  color: string;
}

export interface Room {
  id: string;
  name: string;
  furniture: FurnitureItem[];
}

export interface UserPresence {
  userId: string;
  cursor: Vec2 | null;
  selectedIds: string[];
}

type User = {
  mousePos: {
    x: number;
    y: number;
  };
  color: string;
  name: string;
};

export interface UsersAwareness {
  clientId: number;
  user: User;
}

export type Role = "viewer" | "editor" | "owner";

export type Accessibility = "private" | "public";
