"use client";

import type { SetEntry } from "@/lib/types";

type Props = {
  index: number;
  set: SetEntry;
  onChange: (next: SetEntry) => void;
  onRemove?: () => void;
};

export function SetLogger({ index, set, onChange, onRemove }: Props) {
  return (
    <div className="grid grid-cols-[2rem_1fr_1fr_1fr_auto] gap-2 items-center">
      <span className="text-xs text-muted tabular-nums text-center">#{index + 1}</span>
      <NumField
        value={set.weight}
        step={1.25}
        placeholder="kg"
        decimal
        onChange={(v) => onChange({ ...set, weight: v })}
      />
      <NumField
        value={set.reps}
        step={1}
        placeholder="reps"
        onChange={(v) => onChange({ ...set, reps: v })}
      />
      <NumField
        value={set.rpe}
        step={0.5}
        placeholder="RPE"
        decimal
        min={5}
        max={10}
        onChange={(v) => onChange({ ...set, rpe: v })}
      />
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="text-muted hover:text-danger text-lg leading-none w-6"
          aria-label="Remove set"
        >
          ×
        </button>
      ) : (
        <span className="w-6" />
      )}
    </div>
  );
}

type NumFieldProps = {
  value: number | null;
  step: number;
  placeholder: string;
  decimal?: boolean;
  min?: number;
  max?: number;
  onChange: (v: number | null) => void;
};

function NumField({ value, step, placeholder, decimal, min, max, onChange }: NumFieldProps) {
  return (
    <input
      type="text"
      inputMode={decimal ? "decimal" : "numeric"}
      pattern={decimal ? "[0-9]*[.,]?[0-9]*" : "[0-9]*"}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value.replace(",", ".");
        if (raw === "") return onChange(null);
        const n = Number(raw);
        if (Number.isNaN(n)) return;
        if (min != null && n < min) return onChange(min);
        if (max != null && n > max) return onChange(max);
        onChange(n);
      }}
      onBlur={(e) => {
        const raw = e.target.value.replace(",", ".");
        if (raw === "") return;
        const n = Number(raw);
        if (!Number.isNaN(n) && step) {
          onChange(Math.round(n / step) * step);
        }
      }}
      className="numeric-input"
    />
  );
}
