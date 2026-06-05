import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function SofaIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="8" y="11" width="48" height="42" rx="7" fill="#63553F"/>
      <rect x="8" y="11" width="48" height="12" rx="6" fill="#4E4331"/>
      <rect x="8" y="20" width="10" height="33" rx="5" fill="#4E4331"/>
      <rect x="46" y="20" width="10" height="33" rx="5" fill="#4E4331"/>
      <rect x="19" y="26" width="12.5" height="24" rx="4" fill="#ADA08C"/>
      <rect x="32.5" y="26" width="12.5" height="24" rx="4" fill="#ADA08C"/>
    </svg>
  );
}
export function ChairIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="16" y="11" width="32" height="9" rx="4" fill="#59553F"/>
      <rect x="15" y="19" width="6" height="30" rx="3" fill="#726C51"/>
      <rect x="43" y="19" width="6" height="30" rx="3" fill="#726C51"/>
      <rect x="18" y="19" width="28" height="30" rx="5" fill="#9B936E"/>
      <rect x="22" y="23" width="20" height="22" rx="4" fill="#BBB59C"/>
    </svg>
  );
}
export function BedIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="9" y="6" width="46" height="8" rx="3" fill="#695F54"/>
      <rect x="11" y="11" width="42" height="47" rx="5" fill="#867A6B"/>
      <rect x="11" y="11" width="42" height="47" rx="5" fill="#B6A591"/>
      <rect x="11" y="28" width="42" height="30" rx="5" fill="#867A6B"/>
      <rect x="11" y="28" width="42" height="6" rx="3" fill="#DED6CD"/>
      <rect x="15" y="15" width="15" height="10" rx="3" fill="#CDC1B4"/>
      <rect x="34" y="15" width="15" height="10" rx="3" fill="#CDC1B4"/>
    </svg>
  );
}
export function TableIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="13" y="11" width="6" height="6" rx="1.5" fill="#3C342D"/>
      <rect x="45" y="11" width="6" height="6" rx="1.5" fill="#3C342D"/>
      <rect x="13" y="47" width="6" height="6" rx="1.5" fill="#3C342D"/>
      <rect x="45" y="47" width="6" height="6" rx="1.5" fill="#3C342D"/>
      <rect x="11" y="15" width="42" height="34" rx="4" fill="#695B4E"/>
      <rect x="15" y="19" width="34" height="26" rx="3" fill="#998F86"/>
    </svg>
  );
}
export function DeskIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="8" y="16" width="48" height="32" rx="3" fill="#7D6A5B"/>
      <rect x="11" y="19" width="26" height="26" rx="2" fill="#A6998F"/>
      <rect x="39" y="16" width="17" height="32" rx="3" fill="#5C4E43"/>
      <line x1="39" y1="27" x2="56" y2="27" stroke="#483D34" strokeWidth="1.4"/>
      <line x1="39" y1="37" x2="56" y2="37" stroke="#483D34" strokeWidth="1.4"/>
    </svg>
  );
}
export function BookshelfIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="9" y="20" width="46" height="24" rx="2.5" fill="#352A22"/>
      <rect x="11" y="22" width="42" height="20" rx="1.5" fill="#44362C"/>
      <rect x="13.0" y="24" width="3.8" height="16" rx="0.8" fill="#90837A"/><rect x="17.8" y="24" width="3.0" height="16" rx="0.8" fill="#5C4A3C"/><rect x="21.8" y="24" width="3.8" height="16" rx="0.8" fill="#B5ADA7"/><rect x="26.6" y="24" width="3.0" height="16" rx="0.8" fill="#44362C"/><rect x="30.6" y="24" width="3.8" height="16" rx="0.8" fill="#90837A"/><rect x="35.4" y="24" width="3.0" height="16" rx="0.8" fill="#352A22"/><rect x="39.4" y="24" width="3.8" height="16" rx="0.8" fill="#5C4A3C"/><rect x="44.2" y="24" width="3.0" height="16" rx="0.8" fill="#B5ADA7"/><rect x="48.2" y="24" width="3.8" height="16" rx="0.8" fill="#90837A"/>
    </svg>
  );
}
export function DresserIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="9" y="19" width="46" height="26" rx="3" fill="#655B4F"/>
      <rect x="12" y="22" width="40" height="16" rx="2" fill="#897C6B"/>
      <rect x="9" y="40" width="46" height="5" rx="2" fill="#4F473E"/>
      <circle cx="20" cy="42.5" r="1.6" fill="#AEA59A"/>
      <circle cx="32" cy="42.5" r="1.6" fill="#AEA59A"/>
      <circle cx="44" cy="42.5" r="1.6" fill="#AEA59A"/>
      <rect x="16" y="26" width="10" height="8" rx="1.5" fill="#C9C4BC"/>
      <circle cx="42" cy="30" r="4.5" fill="#AEA59A"/>
    </svg>
  );
}
export function ShelfIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <rect x="7" y="27" width="50" height="11" rx="2" fill="#51453A"/>
      <rect x="7" y="27" width="50" height="11" rx="2" fill="#6E5E4F"/>
      <rect x="14" y="29" width="3.2" height="7" rx="0.8" fill="#9C9187"/>
      <rect x="18" y="29" width="3.2" height="7" rx="0.8" fill="#51453A"/>
      <rect x="22" y="29" width="3.2" height="7" rx="0.8" fill="#BDB6AF"/>
      <circle cx="34" cy="32.5" r="3.4" fill="#51453A"/>
      <rect x="44" y="29" width="8" height="7" rx="1.2" fill="#BDB6AF"/>
    </svg>
  );
}
export function LampIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <circle cx="32" cy="32" r="21" fill="#917C58"/>
      <circle cx="32" cy="32" r="21" fill="#C4A878" opacity="0.55"/>
      <circle cx="32" cy="32" r="15" fill="#C4A878"/>
      <circle cx="32" cy="32" r="8.5" fill="#D6C3A3"/>
      <circle cx="32" cy="32" r="3.2" fill="#E4D7C2"/>
    </svg>
  );
}
export function RugIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <g stroke="#96887A" strokeWidth="1.6" strokeLinecap="round">
      <line x1="32" y1="9" x2="32" y2="5.5"/><line x1="22" y1="10.5" x2="21" y2="7"/><line x1="42" y1="10.5" x2="43" y2="7"/>
      <line x1="32" y1="55" x2="32" y2="58.5"/><line x1="22" y1="53.5" x2="21" y2="57"/><line x1="42" y1="53.5" x2="43" y2="57"/>
      </g>
      <ellipse cx="32" cy="32" rx="26" ry="22" fill="#96887A"/>
      <ellipse cx="32" cy="32" rx="22" ry="18.5" fill="#CBB9A5"/>
      <ellipse cx="32" cy="32" rx="15" ry="12" fill="#DBCFC1"/>
      <ellipse cx="32" cy="32" rx="7" ry="5.5" fill="#96887A"/>
    </svg>
  );
}
export function PlantIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none" {...props}>
      <circle cx="32" cy="33" r="17" fill="#7A4F35"/>
      <circle cx="32" cy="33" r="14" fill="#4A3A2C"/>
      <g transform="rotate(0.0 32 33)"><ellipse cx="32" cy="22" rx="5.5" ry="11" fill="#798C70"/></g><g transform="rotate(51.4 32 33)"><ellipse cx="32" cy="22" rx="5.5" ry="11" fill="#596752"/></g><g transform="rotate(102.9 32 33)"><ellipse cx="32" cy="22" rx="5.5" ry="11" fill="#798C70"/></g><g transform="rotate(154.3 32 33)"><ellipse cx="32" cy="22" rx="5.5" ry="11" fill="#596752"/></g><g transform="rotate(205.7 32 33)"><ellipse cx="32" cy="22" rx="5.5" ry="11" fill="#798C70"/></g><g transform="rotate(257.1 32 33)"><ellipse cx="32" cy="22" rx="5.5" ry="11" fill="#596752"/></g><g transform="rotate(308.6 32 33)"><ellipse cx="32" cy="22" rx="5.5" ry="11" fill="#798C70"/></g>
      <circle cx="32" cy="33" r="4.5" fill="#A3B09D"/>
    </svg>
  );
}

/** Top-down furniture palette — type key -> label, swatch color, plan-view icon. */
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
