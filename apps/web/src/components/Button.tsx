"use client";

export const SketchButton = ({
  disabled = false,
  onClick,
  children,
  primary = false,
  ghost = false,
  className,
  width,
}: {
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  primary?: boolean;
  ghost?: boolean;
  className?: string;
  width?: number | string;
}) => {
  const bg = primary ? "bg-accent" : ghost ? "bg-transparent" : "bg-white";
  const fg = primary ? "text-white" : "text-ink";
  const border = primary ? "border-transparent" : "border-ink";
  const disabledState = disabled
    ? "cursor-not-allowed opacity-50 saturate-50"
    : "cursor-pointer";
  return (
    <button
      disabled={disabled}
      onClick={disabled ? () => {} : onClick}
      style={width ? { width } : undefined}
      className={`${
        className ?? ""
      } ${bg} ${fg} ${border} ${disabledState} font-display inline-flex
       select-none items-center justify-center
        rounded-[6px] border px-[16px] py-[9px] text-[13px]
         font-medium tracking-tight transition-colors duration-200`}
    >
      {children}
    </button>
  );
};
