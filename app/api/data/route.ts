import { NextResponse } from "next/server";
import { getData, saveData } from "@/lib/kv";
import type { WorkoutData } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getData();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const body = (await req.json().catch(() => null)) as WorkoutData | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const saved = await saveData(body);
  return NextResponse.json(saved);
}
