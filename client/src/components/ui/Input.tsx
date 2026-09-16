import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export default function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-igcc-500 focus:ring-2 focus:ring-igcc-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-igcc-border"
        } ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}

      {!error && hint && (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
