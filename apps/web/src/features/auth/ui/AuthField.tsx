import { ChangeEvent } from "react";

interface AuthFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  focused?: boolean;
  type?: "text" | "email" | "pw" | "username";
  onClick?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const AuthField = ({
  label,
  value,
  placeholder,
  focused = false,
  type = "text",
  onClick,
  onChange,
}: AuthFieldProps) => {
  const isMono = type === "email" || type === "pw";
  return (
    <div onClick={onClick} className="flex flex-col gap-[5px]">
      <label className="relative block">
        <span className="font-body text-[11px] uppercase tracking-[0.6px] text-muted">
          {label}
        </span>
        <input
          value={value}
          onChange={onChange}
          type={type === "pw" ? "password" : "text"}
          placeholder={placeholder}
          className={`w-full rounded-[6px] border bg-white px-3 py-[10px] text-[13px] outline-none
      ${isMono ? "font-mono" : "font-body"}
      ${value ? "text-ink" : "text-muted"}
      border-hair
      focus:border-accent focus:ring-[3px] focus:ring-accent/15`}
        />
      </label>
    </div>
  );
};
