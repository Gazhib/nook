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