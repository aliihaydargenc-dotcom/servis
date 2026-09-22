const DB_NAME = 'sehir-asistani';
const DB_VERSION = 1;
const STORE = 'kv';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradened = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getValue(key, fallback = null) {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result ?? fallback);
      req.onerror = () => reject(req.error);
    });
  } catch {
    const raw = localStorage.getItem(`sa:${key}`);
    return raw ? JSON.parse(raw) : fallback;
  }
}

export async function setValue(key, value) {
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(`sa:${key}`, JSON.stringify(value));
  }
}

export async function cached(key, ttl, loader) {
  const record = await getValue(`cache:${key}`);
  const fresh = record && Date.now() - record.savedAt < ttl;
  if (fresh) return { data: record.data, cached: true, savedAt: record.savedAt };
  try {
    const data = await loader();
    const next = { data, savedAt: Date.now() };
    await setValue(`cache:${key}`, next);
    return { ...next, cached: false };
  } catch (error) {
    if (record) return { data: record.data, cached: true, stale: true, savedAt: record.savedAt, error };
    throw error;
  }
}
