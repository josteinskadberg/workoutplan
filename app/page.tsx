import Link from "next/link";
import { Header } from "@/components/Header";
import { getData } from "@/lib/kv";
import {
  DAYS,
  PROGRAM_START,
  PROGRAM_END,
  TOTAL_WEEKS,
  currentWeekFromDate,
  phaseForWeek,
  mainSchemeForWeek,
} from "@/lib/plan";
import { sessionKey } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const data = await getData();
  const week = currentWeekFromDate();
  const phase = phaseForWeek(week);

  return (
    <>
      <Header
        title="Workout plan"
        subtitle={`${PROGRAM_START} → ${PROGRAM_END}`}
      />
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-24">
        <section className="rounded-lg border border-border bg-panel p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                This week
              </p>
              <p className="text-xl font-semibold">
                Week {week} <span className="text-muted">·</span> {phase.label}
              </p>
            </div>
            <span className="chip">Main: {mainSchemeForWeek(week)}</span>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Days
          </h2>
          <ul className="space-y-2">
            {DAYS.map((d) => {
              const logged = data.sessions[sessionKey(week, d.id)];
              return (
                <li key={d.id}>
                  <Link
                    href={`/workout/${week}/${d.id}`}
                    className="block rounded-lg border border-border bg-panel hover:border-accent p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{d.name}</p>
                        <p className="text-xs text-muted">{d.focus}</p>
                      </div>
                      {logged ? (
                        <span className="chip border-accent text-accent">
                          Logged {logged.date}
                        </span>
                      ) : (
                        <span className="chip">Not started</span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="grid grid-cols-2 gap-2">
          <Link href="/progression" className="btn-ghost h-14">
            Main lifts
          </Link>
          <Link href="/markers" className="btn-ghost h-14">
            Markers
          </Link>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            All weeks
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((w) => (
              <Link
                key={w}
                href={`/workout/${w}/1`}
                className={`rounded-md border px-3 py-2 text-center text-sm ${
                  w === week
                    ? "border-accent text-accent"
                    : "border-border text-muted hover:border-accent"
                }`}
              >
                Week {w}
              </Link>
            ))}
          </div>
        </section>

        <form action="/api/logout" method="post" className="pt-4 text-center">
          <button type="submit" className="text-xs text-muted underline">
            Sign out
          </button>
        </form>
      </main>
    </>
  );
}
