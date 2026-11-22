type PainScoreSelectorProps = {
  value: number | null;
  onChange: (value: number | null) => void;
};

function toneFor(score: number, selected: boolean) {
  if (!selected) {
    return "border-slate-300 bg-white text-slate-600 hover:border-igcc-700 hover:text-igcc-800";
  }

  if (score <= 3) return "border-igcc-700 bg-igcc-700 text-white";
  if (score <= 6) return "border-amber-500 bg-amber-500 text-white";
  return "border-red-600 bg-red-600 text-white";
}

export default function PainScoreSelector({
  value,
  onChange,
}: PainScoreSelectorProps) {
  return (
    <div>
      <div
        role="group"
        aria-label="Pain score from 0 to 10"
        className="grid grid-cols-6 gap-2 sm:grid-cols-11"
      >
        {Array.from({ length: 11 }, (_, score) => {
          const selected = value === score;

          return (
            <button
              key={score}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : score)}
              className={
                "min-h-10 rounded-lg border text-sm font-semibold transition " +
                toneFor(score, selected)
              }
            >
              {score}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {value === null
          ? "0 = no pain, 10 = worst pain. Tap a number to record it, tap again to clear."
          : `Recorded: ${value} / 10`}
      </p>
    </div>
  );
}
