export type SetEntry = {
  weight: number | null;
  reps: number | null;
  rpe: number | null;
  seconds: number | null;
};

export type ExerciseLog = {
  sets: SetEntry[];
  notes?: string;
};

export type SessionLog = {
  date: string;
  exercises: Record<string, ExerciseLog>;
  sessionNotes?: string;
};

export type WorkoutData = {
  sessions: Record<string, SessionLog>;
  markers: Record<string, Record<string, string>>;
  baseline: Record<string, string>;
  updatedAt: string;
};

export function emptyData(): WorkoutData {
  return {
    sessions: {},
    markers: {},
    baseline: {},
    updatedAt: new Date(0).toISOString(),
  };
}

export function sessionKey(week: number, day: number): string {
  return `w${week}-d${day}`;
}
