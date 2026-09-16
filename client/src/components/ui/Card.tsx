import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
};

export default function Card({
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`rounded-xl border border-igcc-border bg-white shadow-igcc-sm ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
