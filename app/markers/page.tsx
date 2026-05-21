import { Header } from "@/components/Header";
import { MarkersTable } from "@/components/MarkersTable";
import { getData } from "@/lib/kv";

export const dynamic = "force-dynamic";

export default async function MarkersPage() {
  const data = await getData();
  return (
    <>
      <Header title="Mobility & balance markers" back={{ href: "/", label: "Dashboard" }} />
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-12">
        <p className="text-sm text-muted">
          Test these weekly (Day 1 warm-up is a good time). Baseline is your starting
          point; weekly columns track change.
        </p>
        <MarkersTable initialData={data} />
      </main>
    </>
  );
}
