import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export default function Badge({
  variant = "neutral",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    success: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
    warning:
      "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
    info: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
    neutral:
      "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/10",
    primary:
      "bg-igcc-50 text-igcc-700 ring-1 ring-inset ring-igcc-600/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
