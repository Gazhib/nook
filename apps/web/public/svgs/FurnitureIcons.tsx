import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function SofaIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="10" y="46" width="5" height="8" rx="1.5" fill="#3A2E22"/>
      <rect x="49" y="46" width="5" height="8" rx="1.5" fill="#3A2E22"/>
      <rect x="6" y="20" width="52" height="22" rx="6" fill="#63553F"/>
      <rect x="6" y="28" width="11" height="20" rx="5" fill="#877456"/>
      <rect x="47" y="28" width="11" height="20" rx="5" fill="#877456"/>
      <rect x="16" y="32" width="16" height="14" rx="4" fill="#AB9D88"/>
      <rect x="32" y="32" width="16" height="14" rx="4" fill="#AB9D88"/>
      <line x1="32" y1="34" x2="32" y2="44" stroke="#63553F" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
export function ChairIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="20" y="38" width="4" height="16" rx="1.5" fill="#3A2E22"/>
      <rect x="40" y="38" width="4" height="16" rx="1.5" fill="#3A2E22"/>
      <rect x="22" y="38" width="3.5" height="14" rx="1.5" fill="#3A2E22" opacity="0.7"/>
      <rect x="38.5" y="38" width="3.5" height="14" rx="1.5" fill="#3A2E22" opacity="0.7"/>
      <rect x="22" y="10" width="20" height="28" rx="5" fill="#726C51"/>
      <rect x="26" y="14" width="12" height="20" rx="3" fill="#B9B399"/>
      <rect x="17" y="34" width="30" height="9" rx="3.5" fill="#9B936E"/>
    </svg>
  );
}
export function BedIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="6" y="16" width="8" height="34" rx="3" fill="#6D6357"/>
      <rect x="10" y="34" width="48" height="16" rx="4" fill="#867A6B"/>
      <rect x="14" y="51" width="4" height="6" rx="1.5" fill="#3A2E22"/>
      <rect x="50" y="51" width="4" height="6" rx="1.5" fill="#3A2E22"/>
      <rect x="12" y="26" width="46" height="12" rx="5" fill="#B6A591"/>
      <rect x="30" y="26" width="28" height="12" rx="5" fill="#867A6B"/>
      <rect x="16" y="22" width="14" height="9" rx="4" fill="#CBC0B2"/>
    </svg>
  );
}
export function TableIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="8" y="24" width="48" height="9" rx="3" fill="#695B4E"/>
      <rect x="8" y="24" width="48" height="4" rx="2" fill="#968C83"/>
      <rect x="13" y="33" width="5" height="21" rx="2" fill="#4D4339"/>
      <rect x="46" y="33" width="5" height="21" rx="2" fill="#4D4339"/>
      <rect x="13" y="33" width="38" height="4" fill="#4D4339"/>
    </svg>
  );
}
export function DeskIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="7" y="22" width="50" height="8" rx="3" fill="#7D6A5B"/>
      <rect x="7" y="22" width="50" height="3.5" rx="1.8" fill="#A4968C"/>
      <rect x="11" y="30" width="5" height="24" rx="2" fill="#5C4E43"/>
      <rect x="38" y="30" width="16" height="24" rx="2.5" fill="#5C4E43"/>
      <rect x="41" y="34" width="10" height="6" rx="1.5" fill="#7D6A5B"/>
      <rect x="41" y="43" width="10" height="6" rx="1.5" fill="#7D6A5B"/>
      <rect x="44.5" y="36.5" width="3" height="1.6" rx="0.8" fill="#A4968C"/>
      <rect x="44.5" y="45.5" width="3" height="1.6" rx="0.8" fill="#A4968C"/>
    </svg>
  );
}
export function BookshelfIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="9" y="8" width="34" height="48" rx="3" fill="#372C24"/>
      <rect x="12" y="11" width="28" height="42" rx="1.5" fill="#44362C"/>
      <rect x="12" y="33" width="28" height="2.4" fill="#372C24"/>
      <rect x="12" y="51.5" width="28" height="3" fill="#372C24"/>
      <rect x="14" y="20" width="3.6" height="14" rx="1" fill="#8C8076"/><rect x="18.5" y="16" width="3.6" height="18" rx="1" fill="#5C4A3C"/><rect x="23" y="22" width="3.6" height="12" rx="1" fill="#ADA49D"/><rect x="27.5" y="18" width="3.6" height="16" rx="1" fill="#44362C"/><rect x="14" y="38" width="3.6" height="12" rx="1" fill="#5C4A3C"/><rect x="19" y="34" width="3.6" height="16" rx="1" fill="#44362C"/><rect x="24" y="39" width="3.6" height="11" rx="1" fill="#8C8076"/><rect x="28.5" y="35" width="3.6" height="15" rx="1" fill="#ADA49D"/>
    </svg>
  );
}
export function DresserIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="8" y="14" width="48" height="40" rx="4" fill="#655B4F"/><rect x="13" y="52" width="5" height="5" rx="1.5" fill="#3A2E22"/><rect x="46" y="52" width="5" height="5" rx="1.5" fill="#3A2E22"/><rect x="12" y="18" width="40" height="10" rx="2" fill="#897C6B"/><circle cx="24" cy="23" r="1.8" fill="#524A40"/><circle cx="40" cy="23" r="1.8" fill="#524A40"/><rect x="12" y="30" width="40" height="10" rx="2" fill="#897C6B"/><circle cx="24" cy="35" r="1.8" fill="#524A40"/><circle cx="40" cy="35" r="1.8" fill="#524A40"/><rect x="12" y="42" width="40" height="10" rx="2" fill="#897C6B"/><circle cx="24" cy="47" r="1.8" fill="#524A40"/><circle cx="40" cy="47" r="1.8" fill="#524A40"/>
    </svg>
  );
}
export function ShelfIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="10" y="20" width="44" height="6" rx="2" fill="#6E5E4F"/>
      <rect x="10" y="20" width="44" height="2.6" rx="1.3" fill="#998E83"/>
      <path d="M14 26 h4 v6 l-4 -3 z" fill="#51453A"/>
      <path d="M50 26 h-4 v6 l4 -3 z" fill="#51453A"/>
      <rect x="20" y="13" width="3.4" height="7" rx="1" fill="#51453A"/>
      <rect x="24" y="11" width="3.4" height="9" rx="1" fill="#998E83"/>
      <rect x="28" y="14" width="3.4" height="6" rx="1" fill="#42382F"/>
      <circle cx="40" cy="16.5" r="3.5" fill="#51453A"/>
      <rect x="10" y="42" width="44" height="6" rx="2" fill="#6E5E4F"/>
      <rect x="10" y="42" width="44" height="2.6" rx="1.3" fill="#998E83"/>
      <path d="M14 48 h4 v6 l-4 -3 z" fill="#51453A"/>
      <path d="M50 48 h-4 v6 l4 -3 z" fill="#51453A"/>
      <rect x="22" y="35" width="3.4" height="7" rx="1" fill="#998E83"/>
      <rect x="26" y="33" width="3.4" height="9" rx="1" fill="#51453A"/>
      <rect x="30" y="36" width="3.4" height="6" rx="1" fill="#42382F"/>
    </svg>
  );
}
export function LampIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <path d="M22 12 h20 l4 16 h-28 z" fill="#C4A878"/>
      <path d="M22 12 h20 l1.6 6 h-23.2 z" fill="#D5C2A0"/>
      <rect x="30.5" y="28" width="3" height="20" fill="#917C58"/>
      <path d="M22 54 q10 -8 20 0 z" fill="#756448"/>
      <rect x="22" y="52" width="20" height="3" rx="1.5" fill="#917C58"/>
    </svg>
  );
}
export function RugIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <ellipse cx="32" cy="34" rx="26" ry="17" fill="#96887A"/>
      <ellipse cx="32" cy="34" rx="22" ry="13.5" fill="#CBB9A5"/>
      <ellipse cx="32" cy="34" rx="15" ry="8.5" fill="#DACEC0"/>
      <ellipse cx="32" cy="34" rx="7" ry="3.8" fill="#96887A"/>
      <g stroke="#96887A" strokeWidth="1.4" strokeLinecap="round">
      <line x1="9" y1="40" x2="7" y2="43"/><line x1="20" y1="49" x2="19" y2="52"/>
      <line x1="32" y1="51" x2="32" y2="54.5"/><line x1="44" y1="49" x2="45" y2="52"/>
      <line x1="55" y1="40" x2="57" y2="43"/>
      </g>
    </svg>
  );
}
export function PlantIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <path d="M32 8 C20 14 18 28 26 34 C18 30 14 38 22 40 L42 40 C50 38 46 30 38 34 C46 28 44 14 32 8 Z" fill="#798C70"/>
      <path d="M32 8 C28 16 28 28 32 40 C36 28 36 16 32 8 Z" fill="#596752" opacity="0.55"/>
      <path d="M32 12 C26 18 25 27 30 33" stroke="#A1AE9A" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M22 40 h20 l-3 14 h-14 z" fill="#9A6A4A"/>
      <rect x="20" y="38" width="24" height="5" rx="2" fill="#7A4F35"/>
    </svg>
  );
}

/** Furniture palette registry — type key -> label, swatch color, icon component. */
export const FURNITURE = {
  sofa: { label: "Sofa", color: "#877456", Icon: SofaIcon },
  chair: { label: "Chair", color: "#9B936E", Icon: ChairIcon },
  bed: { label: "Bed", color: "#B6A591", Icon: BedIcon },
  table: { label: "Table", color: "#695B4E", Icon: TableIcon },
  desk: { label: "Desk", color: "#7D6A5B", Icon: DeskIcon },
  bookshelf: { label: "Bookshelf", color: "#5C4A3C", Icon: BookshelfIcon },
  dresser: { label: "Dresser", color: "#897C6B", Icon: DresserIcon },
  shelf: { label: "Shelf", color: "#6E5E4F", Icon: ShelfIcon },
  lamp: { label: "Lamp", color: "#C4A878", Icon: LampIcon },
  rug: { label: "Rug", color: "#CBB9A5", Icon: RugIcon },
  plant: { label: "Plant", color: "#798C70", Icon: PlantIcon },
} as const;

export type FurnitureType = keyof typeof FURNITURE;
