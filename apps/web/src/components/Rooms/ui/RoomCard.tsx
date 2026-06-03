export const RoomCard = ({
  name,
  id,
  when,
  compact = false,
  onClick,
}: {
  onClick?: () => void;
  name: string;
  id: string;
  when?: string;
  compact?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col overflow-hidden rounded-lg 
    border border-hair bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]
    cursor-pointer
    "
    >
      <div
        className={`border-b border-hair-2 bg-paper ${
          compact ? "h-[100px]" : "h-[150px]"
        }`}
      ></div>
      <div
        className={`flex flex-col gap-1.5 ${
          compact ? "px-3 py-2.5" : "px-4 py-3.5"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="font-display text-[14px] font-medium tracking-[-0.1px] text-ink">
            {name}
          </div>
          {/* <Icon name="dots" size={16} color={WF.muted} /> */}
        </div>
        <div className="flex items-center justify-between">
          <div className="font-body text-[11px] text-muted">{when}</div>
        </div>
      </div>
    </div>
  );
};
