import { ChangeEvent, HTMLInputAutoCompleteAttribute, useId } from "react";

interface AuthFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  autoComplete?: HTMLInputAutoCompleteAttribute;
  minLength?: number;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const AuthField = ({
  label,
  name,
  value,
  placeholder,
  type = "text",
  autoComplete,
  minLength,
  disabled,
  onChange,
}: AuthFieldProps) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[12px] font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoCapitalize="none"
        spellCheck={false}
        required
        minLength={minLength}
        disabled={disabled}
        className="min-h-12 w-full rounded-lg border border-hair bg-white px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/75 focus:border-accent focus:ring-3 focus:ring-accent/10 disabled:opacity-60"
      />
    </div>
  );
};
