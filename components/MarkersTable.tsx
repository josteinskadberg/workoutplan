"use client";

import { useState } from "react";
import { MARKERS, TOTAL_WEEKS } from "@/lib/plan";
import type { WorkoutData } from "@/lib/types";

type Props = { initialData: WorkoutData };

type SaveState = "idle" | "saving" | "saved" | "error";

export function MarkersTable({ initialData }: Props) {
  const [data, setData] = useState<WorkoutData>(initialData);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  function updateBaseline(markerId: string, value: string) {
    setData((d) => ({
      ...d,
      baseline: { ...d.baseline, [markerId]: value },
    }));
  }

  function updateWeek(weekKey: string, markerId: string, value: string) {
    setData((d) => ({
      ...d,
      markers: {
        ...d.markers,
        [weekKey]: { ...(d.markers[weekKey] ?? {}), [markerId]: value },
      },
    }));
  }

  async function save() {
    setSaveState("saving");
    try {
      const res = await fetch("/api/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const saved = (await res.json()) as WorkoutData;
      setData(saved);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch {
      setSaveState("error");
    }
  }

  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border bg-panel">
        <table className="min-w-full text-sm">
          <thead className="bg-panel2">
            <tr>
              <th className="text-left px-3 py-2 font-medium sticky left-0 bg-panel2 z-10">
                Marker
              </th>
              <th className="text-center px-3 py-2 font-medium">Baseline</th>
              {weeks.map((w) => (
                <th key={w} className="text-center px-3 py-2 font-medium">
                  Wk {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MARKERS.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="px-3 py-2 sticky left-0 bg-panel z-10">
                  <div className="font-medium leading-tight">{m.name}</div>
                  {m.baselineHint ? (
                    <div className="text-[10px] text-muted">{m.baselineHint}</div>
                  ) : null}
                </td>
                <td className="px-2 py-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={data.baseline[m.id] ?? ""}
                    onChange={(e) => updateBaseline(m.id, e.target.value)}
                    className="numeric-input min-w-[3.5rem]"
                  />
                </td>
                {weeks.map((w) => {
                  const wk = `wk${w}`;
                  return (
                    <td key={w} className="px-2 py-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={data.markers[wk]?.[m.id] ?? ""}
                        onChange={(e) => updateWeek(wk, m.id, e.target.value)}
                        className="numeric-input min-w-[3.5rem]"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-3">
        <span className="text-xs text-muted">
          {saveState === "saved"
            ? "Saved"
            : saveState === "saving"
            ? "Saving…"
            : saveState === "error"
            ? "Save failed"
            : ""}
        </span>
        <button onClick={save} className="btn-primary" disabled={saveState === "saving"}>
          Save
        </button>
      </div>
    </>
  );
}
