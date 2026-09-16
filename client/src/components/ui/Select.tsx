import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
};

export default function Select({
  label,
  error,
  hint,
  options,
  id,
  className = "",
  ...props
}: SelectProps) {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all focus:border-igcc-500 focus:ring-2 focus:ring-igcc-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "border-igcc-border"
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}

      {!error && hint && (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}
