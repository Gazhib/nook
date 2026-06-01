export const OrRule = ({ label = "or" }: { label?: string }) => {
  return (
    <div className="flex items-center gap-[10px]">
      <div className="h-px flex-1 bg-hair-2" />
      <div className="font-body text-[11px] text-muted">{label}</div>
      <div className="h-px flex-1 bg-hair-2" />
    </div>
  );
};
