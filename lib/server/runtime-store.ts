import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  type DemoCase,
  type DemoLead,
  type DemoMonitoringHit,
  type DemoNotification,
  type DemoTip,
} from "@/lib/types";

export type RuntimeStore = {
  cases: DemoCase[];
  tips: DemoTip[];
  leads: DemoLead[];
  monitoringHits: DemoMonitoringHit[];
  notifications: DemoNotification[];
};

const RUNTIME_DIR = path.join(process.cwd(), ".runtime");
const STORE_PATH = path.join(RUNTIME_DIR, "store.json");

const EMPTY_STORE: RuntimeStore = {
  cases: [],
  tips: [],
  leads: [],
  monitoringHits: [],
  notifications: [],
};

async function ensureStore() {
  await mkdir(RUNTIME_DIR, { recursive: true });

  try {
    await readFile(STORE_PATH, "utf8");
  } catch {
    await writeFile(STORE_PATH, JSON.stringify(EMPTY_STORE, null, 2), "utf8");
  }
}

export async function readRuntimeStore() {
  await ensureStore();

  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<RuntimeStore>;

    return {
      cases: parsed.cases ?? [],
      tips: parsed.tips ?? [],
      leads: parsed.leads ?? [],
      monitoringHits: parsed.monitoringHits ?? [],
      notifications: parsed.notifications ?? [],
    } satisfies RuntimeStore;
  } catch {
    return EMPTY_STORE;
  }
}

export async function writeRuntimeStore(store: RuntimeStore) {
  await ensureStore();
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  return store;
}

export async function updateRuntimeStore(
  updater: (store: RuntimeStore) => RuntimeStore | Promise<RuntimeStore>,
) {
  const current = await readRuntimeStore();
  const next = await updater(JSON.parse(JSON.stringify(current)) as RuntimeStore);
  await writeRuntimeStore(next);
  return next;
}
