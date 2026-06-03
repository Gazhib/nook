const tags = ["apartment", "rental", "family"];

export const RoomsSidebar = () => {
  return (
    <div className="w-[220px] border-r border-hair bg-white p-4 font-body">
      <div className="mb-2 text-[11px] uppercase tracking-[0.6px] text-muted">
        Spaces
      </div>
      {["All rooms", "Starred", "Shared with me", "Archive"].map((s, i) => (
        <div
          key={i}
          className={`mb-0.5 rounded px-2 py-1.5 text-[13px] ${
            i === 0
              ? "bg-paper font-medium text-ink"
              : "bg-transparent font-normal text-ink-2"
          }`}
        >
          {s}
        </div>
      ))}
      <div className="mb-2 mt-4 text-[11px] uppercase tracking-[0.6px] text-muted">
        Tags
      </div>
      {tags.map((t) => (
        <div
          key={t}
          className="flex items-center gap-1.5 px-2 py-1 text-[12px] text-ink-2"
        >
          <div className="h-2 w-2 rounded-sm bg-accent opacity-60" />
          {t}
        </div>
      ))}
    </div>
  );
};
