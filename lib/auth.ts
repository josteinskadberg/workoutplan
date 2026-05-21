export const AUTH_COOKIE = "wp_auth";

function password(): string {
  const p = process.env.APP_PASSWORD;
  if (!p) throw new Error("APP_PASSWORD env var not set");
  return p;
}

async function hmacSha256Hex(key: string, msg: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(msg));
  return toHex(new Uint8Array(sig));
}

function toHex(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, "0");
  }
  return s;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function tokenFor(pw: string): Promise<string> {
  return hmacSha256Hex(password(), pw);
}

export async function verifyToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const expected = await tokenFor(password());
    return constantTimeEqual(token, expected);
  } catch {
    return false;
  }
}

export function checkPassword(submitted: string): boolean {
  try {
    return constantTimeEqual(submitted, password());
  } catch {
    return false;
  }
}
