import { NextResponse } from "next/server";
import { AUTH_COOKIE, checkPassword, tokenFor } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const json = form ? null : await req.json().catch(() => null);
  const submitted =
    (form?.get("password") as string | null) ?? (json?.password as string | undefined);
  const nextPath =
    (form?.get("next") as string | null) ?? (json?.next as string | undefined) ?? "/";

  if (!submitted || !checkPassword(submitted)) {
    const redirect = new URL("/login", req.url);
    redirect.searchParams.set("error", "1");
    if (nextPath) redirect.searchParams.set("next", nextPath);
    return NextResponse.redirect(redirect, { status: 303 });
  }

  const target = new URL(safeNext(nextPath), req.url);
  const res = NextResponse.redirect(target, { status: 303 });
  const tok = await tokenFor(submitted);
  res.cookies.set(AUTH_COOKIE, tok, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90 days
  });
  return res;
}

export async function DELETE(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  res.cookies.delete(AUTH_COOKIE);
  return res;
}

function safeNext(next: string | undefined): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}
