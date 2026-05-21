import { Redis } from "@upstash/redis";
import { emptyData, type WorkoutData } from "./types";

const KEY = "workout:data";

let client: Redis | null = null;

function getClient(): Redis {
  if (client) return client;
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Missing Redis credentials. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL/KV_REST_API_TOKEN).",
    );
  }
  client = new Redis({ url, token });
  return client;
}

export async function getData(): Promise<WorkoutData> {
  try {
    const v = await getClient().get<WorkoutData>(KEY);
    return v ?? emptyData();
  } catch (err) {
    console.error("Redis getData failed", err);
    return emptyData();
  }
}

export async function saveData(data: WorkoutData): Promise<WorkoutData> {
  const next: WorkoutData = { ...data, updatedAt: new Date().toISOString() };
  await getClient().set(KEY, next);
  return next;
}
