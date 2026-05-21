import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { SessionScreen } from "@/components/SessionScreen";
import { DAYS, TOTAL_WEEKS, getDay } from "@/lib/plan";
import { getData } from "@/lib/kv";
import { suggestNextWeight, type Suggestion } from "@/lib/progression";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ week: string; day: string }>;
};

export default async function WorkoutSession({ params }: Props) {
  const { week: weekStr, day: dayStr } = await params;
  const week = Number(weekStr);
  const dayId = Number(dayStr);
  if (!Number.isFinite(week) || week < 1 || week > TOTAL_WEEKS) notFound();
  const day = getDay(dayId);
  if (!day) notFound();

  const data = await getData();
  const suggestions: Record<string, Suggestion> = {};
  for (const ex of day.exercises) {
    suggestions[ex.id] = suggestNextWeight(data, ex.id, week, day.id);
  }

  const prevHref = navHref(week, day.id, -1);
  const nextHref = navHref(week, day.id, +1);

  return (
    <>
      <Header
        title={`Week ${week} · ${day.name}`}
        subtitle={day.focus}
        back={{ href: "/", label: "Dashboard" }}
      />
      <nav className="max-w-2xl mx-auto px-4 pt-3 flex justify-between text-xs">
        <a href={prevHref ?? "#"} className={prevHref ? "text-muted hover:text-accent" : "text-muted/40 pointer-events-none"}>
          ← Prev
        </a>
        <a href={nextHref ?? "#"} className={nextHref ? "text-muted hover:text-accent" : "text-muted/40 pointer-events-none"}>
          Next →
        </a>
      </nav>
      <SessionScreen week={week} day={day} initialData={data} suggestions={suggestions} />
    </>
  );
}

function navHref(week: number, dayId: number, delta: number): string | null {
  let d = dayId + delta;
  let w = week;
  if (d > DAYS.length) {
    d = 1;
    w += 1;
  } else if (d < 1) {
    d = DAYS.length;
    w -= 1;
  }
  if (w < 1 || w > TOTAL_WEEKS) return null;
  return `/workout/${w}/${d}`;
}
