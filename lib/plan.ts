export type ExerciseDef = {
  id: string;
  name: string;
  target: string;
  bodyweightSwap?: string;
  isMain?: boolean;
  defaultSets: number;
  videoUrl?: string;
};

export type DayDef = {
  id: 1 | 2 | 3 | 4;
  name: string;
  focus: string;
  exercises: ExerciseDef[];
};

export type PhaseDef = {
  weeks: [number, number];
  label: string;
  mainSets: number;
  mainReps: string;
  mainRpe: string;
  accessoryReps: string;
};

export const PROGRAM_START = "2026-05-25";
export const PROGRAM_END = "2026-07-05";
export const TOTAL_WEEKS = 6;

export const PHASES: PhaseDef[] = [
  {
    weeks: [1, 2],
    label: "Foundation",
    mainSets: 3,
    mainReps: "8",
    mainRpe: "6-7",
    accessoryReps: "10-12",
  },
  {
    weeks: [3, 4],
    label: "Build",
    mainSets: 4,
    mainReps: "6",
    mainRpe: "7-8",
    accessoryReps: "8-10",
  },
  {
    weeks: [5, 6],
    label: "Peak",
    mainSets: 4,
    mainReps: "4-5",
    mainRpe: "8",
    accessoryReps: "8",
  },
];

export function phaseForWeek(week: number): PhaseDef {
  const p = PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1]);
  return p ?? PHASES[0];
}

export function mainSchemeForWeek(week: number): string {
  const p = phaseForWeek(week);
  return `${p.mainSets}×${p.mainReps} @ RPE ${p.mainRpe}`;
}

export const DAYS: DayDef[] = [
  {
    id: 1,
    name: "Day 1 — Squat",
    focus: "Squat focus",
    exercises: [
      {
        id: "back-squat",
        name: "Back squat",
        target: "Main scheme",
        bodyweightSwap: "Bulgarian split squat",
        isMain: true,
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/watch?v=RpBf5ZRdvWE&t=157s",
      },
      {
        id: "atg-split-squat",
        name: "ATG split squat",
        target: "3×8 each leg",
        bodyweightSwap: "Bodyweight, slow tempo",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/watch?v=4qPJUSczLcM",
      },
      {
        id: "leg-extension",
        name: "Leg extension",
        target: "3×12",
        bodyweightSwap: "Sissy squat (assisted)",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/iQ92TuvBqRo",
      },
      {
        id: "standing-calf-raise",
        name: "Standing calf raise",
        target: "3×15",
        bodyweightSwap: "Single-leg off step",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/baEXLy09Ncc",
      },
      {
        id: "dead-bug",
        name: "Dead bug",
        target: "3×10 each side",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/1g7k3vPYkQA",
      },
      {
        id: "single-leg-stance-d1",
        name: "Single-leg stance, eyes closed",
        target: "3×30 sec each",
        defaultSets: 3,
      },
    ],
  },
  {
    id: 2,
    name: "Day 2 — Hinge",
    focus: "Hinge focus",
    exercises: [
      {
        id: "romanian-deadlift",
        name: "Romanian deadlift",
        target: "Main scheme",
        bodyweightSwap: "Single-leg RDL, slow",
        isMain: true,
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/5rIqP63yWFg",
      },
      {
        id: "hip-thrust",
        name: "Hip thrust",
        target: "3×10",
        bodyweightSwap: "Single-leg glute bridge",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/watch?v=pF17m_CXfL0",
      },
      {
        id: "walking-lunge",
        name: "Walking lunge",
        target: "3×10 each leg",
        bodyweightSwap: "Bodyweight, deeper",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/watch?v=tQNktxPkSeE",
      },
      {
        id: "tibialis-raise-d2",
        name: "Tibialis raise",
        target: "3×15",
        bodyweightSwap: "Heel walks 30 sec",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/pQcvW08rnAk",
      },
      {
        id: "pallof-press",
        name: "Pallof press",
        target: "3×10 each side",
        bodyweightSwap: "Band on door",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/watch?v=ma2OjgP5XDc",
      },
    ],
  },
  {
    id: 3,
    name: "Day 3 — Balance",
    focus: "Single-leg + Balance + Mobility",
    exercises: [
      {
        id: "cossack-squat",
        name: "Cossack squat",
        target: "3×6 each side",
        bodyweightSwap: "Bodyweight",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/MJvazUpmdZU",
      },
      {
        id: "step-up",
        name: "Step-up (knee-over-toe)",
        target: "3×8 each leg",
        bodyweightSwap: "Bodyweight, slow",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/K3plWYWTFVw",
      },
      {
        id: "single-leg-rdl",
        name: "Single-leg RDL",
        target: "3×8 each leg",
        bodyweightSwap: "Bodyweight, arms out",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/R_fJ6H3FlVw",
      },
      {
        id: "peterson-step-up",
        name: "Peterson step-up",
        target: "3×10 each leg",
        bodyweightSwap: "Bodyweight",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/watch?v=yuvRE6PsvJw",
      },
      {
        id: "copenhagen-plank",
        name: "Copenhagen plank",
        target: "3×20 sec each side",
        bodyweightSwap: "Knee on chair",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/watch?v=aDsaGBnvDQo",
      },
      {
        id: "kb-windmill",
        name: "KB windmill / half TGU",
        target: "3×5 each side",
        bodyweightSwap: "Bodyweight focus form",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/watch?v=4dTvEXgzWqM",
      },
      {
        id: "mobility-flow",
        name: "Mobility flow (10 min)",
        target: "90/90 · couch · CARs",
        defaultSets: 1,
        videoUrl: "https://www.youtube.com/watch?v=P4GfbdNvOT8&t=91s",
      },
    ],
  },
  {
    id: 4,
    name: "Day 4 — Posterior",
    focus: "Posterior + Calves/Shins + Core",
    exercises: [
      {
        id: "trap-bar-deadlift",
        name: "Trap-bar deadlift",
        target: "Main scheme",
        bodyweightSwap: "Single-leg RDL, paused",
        isMain: true,
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/v-SrIcAp3vM",
      },
      {
        id: "nordic-ham-curl",
        name: "Nordic ham curl (eccentric)",
        target: "3×5",
        bodyweightSwap: "Hands assist on way up",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/watch?v=6NCN6kOagfY",
      },
      {
        id: "reverse-lunge",
        name: "Reverse lunge",
        target: "3×10 each leg",
        bodyweightSwap: "Bodyweight",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/38xlLGfguz4",
      },
      {
        id: "standing-calf-raise-d4",
        name: "Standing calf raise",
        target: "4×10",
        bodyweightSwap: "Single-leg slow eccentric",
        defaultSets: 4,
        videoUrl: "https://www.youtube.com/shorts/baEXLy09Ncc",
      },
      {
        id: "tibialis-raise-d4",
        name: "Tibialis raise",
        target: "3×15",
        bodyweightSwap: "Heel walks 45 sec",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/pQcvW08rnAk",
      },
      {
        id: "hanging-leg-raise",
        name: "Hanging leg raise",
        target: "3×8",
        bodyweightSwap: "Lying leg raise",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/shorts/2n4UqRIJyk4",
      },
      {
        id: "suitcase-carry",
        name: "Suitcase carry",
        target: "3×30 sec each side",
        bodyweightSwap: "Backpack weighted",
        defaultSets: 3,
        videoUrl: "https://www.youtube.com/watch?v=3RKKnZhhelE",
      },
    ],
  },
];

export function getDay(dayId: number): DayDef | undefined {
  return DAYS.find((d) => d.id === dayId);
}

export function findExercise(exerciseId: string): ExerciseDef | undefined {
  for (const d of DAYS) {
    const e = d.exercises.find((e) => e.id === exerciseId);
    if (e) return e;
  }
  return undefined;
}

export const MAIN_LIFT_IDS = ["back-squat", "romanian-deadlift", "trap-bar-deadlift"] as const;

export const WARMUP_ITEMS: string[] = [
  "90/90 hip switches — 8 each side",
  "World's greatest stretch — 4 each side",
  "Deep squat hold — 30 sec",
  "Ankle wall rocks — 10 each side",
  "Cossack squat — 5 each side",
  "Glute bridges — 15 reps",
  "Tibialis raises — 15 reps",
];

export type MarkerDef = { id: string; name: string; baselineHint?: string };

export const MARKERS: MarkerDef[] = [
  { id: "deep-squat-hold", name: "Deep squat hold (sec, heels down)", baselineHint: "target ~30" },
  { id: "sls-left", name: "Single-leg stance L, eyes closed (sec)", baselineHint: "target ~10" },
  { id: "sls-right", name: "Single-leg stance R, eyes closed (sec)" },
  { id: "couch-stretch-l", name: "Couch stretch comfort 1-5 (L)" },
  { id: "couch-stretch-r", name: "Couch stretch comfort 1-5 (R)" },
  { id: "ankle-wall-l", name: "Ankle wall test cm (L)" },
  { id: "ankle-wall-r", name: "Ankle wall test cm (R)" },
  { id: "bodyweight", name: "Bodyweight (kg)" },
  { id: "rhr", name: "Resting heart rate (optional)" },
];

export function currentWeekFromDate(today: Date = new Date()): number {
  const start = new Date(PROGRAM_START + "T00:00:00");
  const diffMs = today.getTime() - start.getTime();
  const week = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(TOTAL_WEEKS, week));
}
