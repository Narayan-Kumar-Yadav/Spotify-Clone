import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "ghost" | "primary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  ghost:
    "bg-white/5 text-textPrimary ring-1 ring-white/10 hover:bg-white/10 hover:text-textPrimary",
  primary: "bg-accent text-background shadow-glow hover:brightness-110 hover:shadow-glow",
};

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-visible:ring-accent/70 focus-visible:ring-offset-background inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
