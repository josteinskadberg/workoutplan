import { phaseForWeek, MAIN_LIFT_IDS } from "./plan";
import { sessionKey, type WorkoutData } from "./types";

const RPE_TARGET_BY_PHASE: Record<string, number> = {
  Foundation: 7,
  Build: 8,
  Peak: 8,
};

const TARGET_REPS_BY_PHASE: Record<string, number> = {
  Foundation: 8,
  Build: 6,
  Peak: 4,
};

export type Suggestion = {
  weight: number | null;
  reason: string;
};

export function isMainLift(exerciseId: string): boolean {
  return (MAIN_LIFT_IDS as readonly string[]).includes(exerciseId);
}

export function suggestNextWeight(
  data: WorkoutData,
  exerciseId: string,
  currentWeek: number,
  currentDay: number,
): Suggestion {
  if (!isMainLift(exerciseId)) return { weight: null, reason: "" };
  if (currentWeek < 1) return { weight: null, reason: "" };

  for (let w = currentWeek - 1; w >= 1; w--) {
    const prev = data.sessions[sessionKey(w, currentDay)];
    const log = prev?.exercises?.[exerciseId];
    if (!log) continue;
    const workingSets = log.sets.filter((s) => s.weight != null);
    if (workingSets.length === 0) continue;

    const topWeight = Math.max(...workingSets.map((s) => s.weight ?? 0));
    const phase = phaseForWeek(currentWeek);
    const targetReps = TARGET_REPS_BY_PHASE[phase.label] ?? 8;
    const rpeTarget = RPE_TARGET_BY_PHASE[phase.label] ?? 7;

    const allHit = workingSets.every((s) => (s.reps ?? 0) >= targetReps);
    const avgRpe =
      workingSets.reduce((a, s) => a + (s.rpe ?? 10), 0) / workingSets.length;

    if (allHit && avgRpe <= rpeTarget) {
      return {
        weight: round25(topWeight + 2.5),
        reason: `Last session: ${topWeight} kg — all reps hit at RPE ${avgRpe.toFixed(1)}. Add 2.5 kg.`,
      };
    }
    return {
      weight: round25(topWeight),
      reason: `Last session: ${topWeight} kg @ avg RPE ${avgRpe.toFixed(1)}. Repeat.`,
    };
  }
  return { weight: null, reason: "No prior session logged yet." };
}

function round25(n: number): number {
  return Math.round(n * 4) / 4;
}
