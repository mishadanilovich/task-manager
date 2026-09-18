import "server-only";

import { createMemoryDatabase } from "./memory";
import type { Database } from "./repository";
import { createSeedData } from "./seed";

const globalForDb = globalThis as typeof globalThis & { taskManagerDb?: Database };

function getLatencyMs(): number {
  const fromEnv = Number(process.env.DATA_LATENCY_MS);
  if (Number.isFinite(fromEnv)) return fromEnv;

  return process.env.NODE_ENV === "development" ? 350 : 0;
}

export const db: Database =
  globalForDb.taskManagerDb ??
  createMemoryDatabase(createSeedData(new Date()), { latencyMs: getLatencyMs() });

globalForDb.taskManagerDb = db;
