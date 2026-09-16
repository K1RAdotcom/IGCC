import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-igcc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-igcc-600 text-white shadow-igcc-sm hover:bg-igcc-700 active:bg-igcc-800",
    secondary:
      "border border-igcc-border bg-white text-slate-700 shadow-igcc-sm hover:bg-slate-50",
    danger:
      "bg-red-600 text-white shadow-igcc-sm hover:bg-red-700 active:bg-red-800",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
