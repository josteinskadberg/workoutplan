import { Header } from "@/components/Header";
import { getData } from "@/lib/kv";
import { MAIN_LIFT_IDS, TOTAL_WEEKS, DAYS, findExercise, mainSchemeForWeek } from "@/lib/plan";
import { sessionKey } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProgressionPage() {
  const data = await getData();
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

  return (
    <>
      <Header title="Main lifts" back={{ href: "/", label: "Dashboard" }} />
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-12">
        <p className="text-sm text-muted">
          Top working set per week. Auto-derived from logged sessions.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border bg-panel">
          <table className="min-w-full text-sm">
            <thead className="bg-panel2">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Lift</th>
                {weeks.map((w) => (
                  <th key={w} className="text-center px-3 py-2 font-medium whitespace-nowrap">
                    Wk {w}
                    <div className="text-[10px] text-muted font-normal">
                      {mainSchemeForWeek(w).split(" @ ")[0]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MAIN_LIFT_IDS.map((id) => {
                const ex = findExercise(id);
                if (!ex) return null;
                const dayId = DAYS.find((d) =>
                  d.exercises.some((e) => e.id === id && e.isMain),
                )?.id;
                return (
                  <tr key={id} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">{ex.name}</td>
                    {weeks.map((w) => {
                      const log = dayId
                        ? data.sessions[sessionKey(w, dayId)]?.exercises?.[id]
                        : undefined;
                      const top = topSet(log?.sets);
                      return (
                        <td key={w} className="px-3 py-2 text-center tabular-nums">
                          {top ? (
                            <>
                              {top.weight}
                              <span className="text-muted">×</span>
                              {top.reps}
                              <div className="text-[10px] text-muted">
                                RPE {top.rpe ?? "—"}
                              </div>
                            </>
                          ) : (
                            <span className="text-muted/50">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

function topSet(sets: { weight: number | null; reps: number | null; rpe: number | null }[] | undefined) {
  if (!sets || sets.length === 0) return null;
  const valid = sets.filter((s) => s.weight != null);
  if (valid.length === 0) return null;
  return valid.reduce((best, s) => ((s.weight ?? 0) > (best.weight ?? 0) ? s : best));
}
