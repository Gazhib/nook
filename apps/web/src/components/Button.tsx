"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  primary?: boolean;
  ghost?: boolean;
  width?: number | string;
};

export const SketchButton = ({
  primary = false,
  ghost = false,
  className = "",
  width,
  type = "button",
  style,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    style={{ ...style, ...(width ? { width } : {}) }}
    className={`nook-button ${primary ? "nook-button-primary" : ghost ? "nook-button-ghost" : "nook-button-secondary"} ${className}`}
    {...props}
  />
);
