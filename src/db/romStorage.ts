import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AbandonwareDB extends DBSchema {
  roms: {
    key: string;
    value: { id: string; blob: Blob };
  };
  bios: {
    key: string;
    value: { platform: string; blob: Blob };
  };
}

const DB_NAME = 'abandonware-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<AbandonwareDB>> | null = null;

function getDB(): Promise<IDBPDatabase<AbandonwareDB>> {
  if (!dbPromise) {
    dbPromise = openDB<AbandonwareDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('roms', { keyPath: 'id' });
        db.createObjectStore('bios', { keyPath: 'platform' });
      },
    });
  }
  return dbPromise;
}

export async function saveRom(id: string, blob: Blob): Promise<void> {
  const db = await getDB();
  await db.put('roms', { id, blob });
}

export async function getRom(id: string): Promise<Blob | null> {
  const db = await getDB();
  const entry = await db.get('roms', id);
  return entry?.blob ?? null;
}

export async function deleteRom(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('roms', id);
}

export async function saveBios(platform: string, blob: Blob): Promise<void> {
  const db = await getDB();
  await db.put('bios', { platform, blob });
}

export async function getBios(platform: string): Promise<Blob | null> {
  const db = await getDB();
  const entry = await db.get('bios', platform);
  return entry?.blob ?? null;
}
