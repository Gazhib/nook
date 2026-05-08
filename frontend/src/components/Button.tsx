export const SketchButton = ({
  children,
  primary = false,
  ghost = false,
  className,
  width,
}: {
  children: React.ReactNode;
  primary?: boolean;
  ghost?: boolean;
  className?: string;
  width?: number | string;
}) => {
  const bg = primary ? "bg-accent" : ghost ? "bg-transparent" : "bg-white";
  const fg = primary ? "text-white" : "text-ink";
  const border = primary ? "border-transparent" : "border-ink";
  return (
    <div
      style={width ? { width } : undefined}
      className={`${className ?? ""} ${bg} ${fg} ${border} font-display inline-flex cursor-pointer select-none items-center justify-center rounded-[6px] border px-[16px] py-[9px] text-[13px] font-medium tracking-tight transition-colors duration-200`}
    >
      {children}
    </div>
  );
};
