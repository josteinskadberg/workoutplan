"use client";

import { useEffect, useMemo, useState } from "react";
import { SetLogger } from "./SetLogger";
import { RestTimer } from "./RestTimer";
import type { DayDef, ExerciseDef } from "@/lib/plan";
import { phaseForWeek, mainSchemeForWeek, WARMUP_ITEMS } from "@/lib/plan";
import { sessionKey, type SetEntry, type SessionLog, type WorkoutData } from "@/lib/types";
import type { Suggestion } from "@/lib/progression";

type Props = {
  week: number;
  day: DayDef;
  initialData: WorkoutData;
  suggestions: Record<string, Suggestion>;
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function SessionScreen({ week, day, initialData, suggestions }: Props) {
  const key = sessionKey(week, day.id);
  const [data, setData] = useState<WorkoutData>(initialData);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [warmupOpen, setWarmupOpen] = useState(false);

  const session: SessionLog = useMemo(() => {
    const existing = data.sessions[key];
    if (existing) return existing;
    return {
      date: new Date().toISOString().slice(0, 10),
      exercises: {},
      sessionNotes: "",
    };
  }, [data, key]);

  useEffect(() => {
    if (!data.sessions[key]) {
      setData((d) => ({
        ...d,
        sessions: { ...d.sessions, [key]: session },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSession(mutator: (s: SessionLog) => SessionLog) {
    setData((d) => ({
      ...d,
      sessions: { ...d.sessions, [key]: mutator(d.sessions[key] ?? session) },
    }));
  }

  function updateExercise(
    exerciseId: string,
    defaultSets: number,
    mutator: (sets: SetEntry[]) => SetEntry[],
  ) {
    updateSession((s) => {
      const log = s.exercises[exerciseId] ?? {
        sets: Array.from({ length: defaultSets }, emptySet),
      };
      return {
        ...s,
        exercises: { ...s.exercises, [exerciseId]: { ...log, sets: mutator(log.sets) } },
      };
    });
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

  const phase = phaseForWeek(week);

  return (
    <main className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-32">
      <section className="rounded-lg border border-border bg-panel p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">
            {phase.label} · Main lift: {mainSchemeForWeek(week)}
          </span>
          <input
            type="date"
            value={session.date}
            onChange={(e) =>
              updateSession((s) => ({ ...s, date: e.target.value || s.date }))
            }
            className="bg-panel2 border border-border rounded-md px-2 py-1 text-xs"
          />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-panel">
        <button
          type="button"
          onClick={() => setWarmupOpen((o) => !o)}
          className="w-full text-left px-4 py-3 flex items-center justify-between"
        >
          <span className="font-medium">Warm-up (~5 min)</span>
          <span className="text-muted text-xs">{warmupOpen ? "Hide" : "Show"}</span>
        </button>
        {warmupOpen ? (
          <ul className="px-4 pb-4 space-y-1 text-sm text-muted list-disc list-inside">
            {WARMUP_ITEMS.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <ul className="space-y-3">
        {day.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            ex={ex}
            sets={
              session.exercises[ex.id]?.sets ??
              Array.from({ length: ex.defaultSets }, emptySet)
            }
            notes={session.exercises[ex.id]?.notes ?? ""}
            suggestion={suggestions[ex.id]}
            week={week}
            onSetsChange={(next) => updateExercise(ex.id, ex.defaultSets, () => next)}
            onNotesChange={(notes) =>
              updateSession((s) => {
                const log = s.exercises[ex.id] ?? {
                  sets: Array.from({ length: ex.defaultSets }, emptySet),
                };
                return {
                  ...s,
                  exercises: { ...s.exercises, [ex.id]: { ...log, notes } },
                };
              })
            }
          />
        ))}
      </ul>

      <section className="space-y-2">
        <label className="text-xs uppercase tracking-wider text-muted">
          Session notes
        </label>
        <textarea
          value={session.sessionNotes ?? ""}
          onChange={(e) =>
            updateSession((s) => ({ ...s, sessionNotes: e.target.value }))
          }
          rows={3}
          className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
          placeholder="How did it feel?"
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-wider text-muted">Rest timer</h2>
        <RestTimer />
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-bg/95 backdrop-blur border-t border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-xs text-muted flex-1 truncate">
            {saveState === "saved"
              ? "Saved"
              : saveState === "saving"
              ? "Saving…"
              : saveState === "error"
              ? "Save failed — retry"
              : `Last saved ${formatTime(data.updatedAt)}`}
          </span>
          <button
            type="button"
            onClick={save}
            disabled={saveState === "saving"}
            className="btn-primary px-6 py-3 disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </main>
  );
}

type ExerciseCardProps = {
  ex: ExerciseDef;
  sets: SetEntry[];
  notes: string;
  suggestion?: Suggestion;
  week: number;
  onSetsChange: (sets: SetEntry[]) => void;
  onNotesChange: (notes: string) => void;
};

function ExerciseCard({
  ex,
  sets,
  notes,
  suggestion,
  week,
  onSetsChange,
  onNotesChange,
}: ExerciseCardProps) {
  const mainTarget = ex.isMain ? mainSchemeForWeek(week) : null;
  return (
    <li className="rounded-lg border border-border bg-panel p-4 space-y-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p className="font-semibold truncate min-w-0">{ex.name}</p>
            {ex.videoUrl ? (
              <a
                href={ex.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center rounded-full border border-accent/70 bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent whitespace-nowrap hover:bg-accent/25"
              >
                ▶ Video
              </a>
            ) : null}
          </div>
          <p className="text-xs text-muted">{mainTarget ?? ex.target}</p>
          {ex.bodyweightSwap ? (
            <p className="text-[11px] text-muted/80 mt-1">
              Swap: {ex.bodyweightSwap}
            </p>
          ) : null}
        </div>
        {suggestion?.weight != null ? (
          <span className="chip border-accent text-accent whitespace-nowrap" title={suggestion.reason}>
            Try {suggestion.weight} kg
          </span>
        ) : null}
      </header>
      <div className="space-y-2">
        {sets.map((s, i) => (
          <SetLogger
            key={i}
            index={i}
            set={s}
            tracking={ex.tracking ?? "weighted"}
            onChange={(next) => {
              const copy = sets.slice();
              copy[i] = next;
              onSetsChange(copy);
            }}
            onRemove={
              sets.length > 1
                ? () => {
                    const copy = sets.slice();
                    copy.splice(i, 1);
                    onSetsChange(copy);
                  }
                : undefined
            }
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn-ghost text-xs px-2 py-1"
          onClick={() => onSetsChange([...sets, emptySet()])}
        >
          + Set
        </button>
        <button
          type="button"
          className="btn-ghost text-xs px-2 py-1"
          onClick={() => {
            const last = sets[sets.length - 1];
            onSetsChange([...sets, { ...last }]);
          }}
        >
          + Repeat last
        </button>
      </div>
      <input
        type="text"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Notes…"
        className="w-full bg-panel2 border border-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-accent"
      />
    </li>
  );
}

function emptySet(): SetEntry {
  return { weight: null, reps: null, rpe: null, seconds: null };
}

function formatTime(iso: string): string {
  if (!iso || iso.startsWith("1970")) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
