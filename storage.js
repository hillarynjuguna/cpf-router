const DB_NAME = 'cpf-router-pwa';
const DB_VERSION = 1;
const STORE_PREFS = 'prefs';
const STORE_SESSIONS = 'sessions';

function hasIndexedDB() {
  return typeof indexedDB !== 'undefined';
}

function openDB() {
  if (!hasIndexedDB()) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_PREFS)) db.createObjectStore(STORE_PREFS);
      if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
        db.createObjectStore(STORE_SESSIONS, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore(storeName, mode, callback) {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    Promise.resolve(callback(store))
      .then(result => {
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error);
      })
      .catch(reject);
  });
}

function readLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignored
  }
}

export async function loadPrefs() {
  const db = await openDB();
  if (!db) {
    return {
      ache: readLocal('cpf_ache', ''),
      checklistState: readLocal('cpf_checklist_state', {}),
    };
  }
  const ache = await withStore(STORE_PREFS, 'readonly', store => new Promise((resolve, reject) => {
    const req = store.get('ache');
    req.onsuccess = () => resolve(req.result ?? '');
    req.onerror = () => reject(req.error);
  }));
  const checklistState = await withStore(STORE_PREFS, 'readonly', store => new Promise((resolve, reject) => {
    const req = store.get('checklistState');
    req.onsuccess = () => resolve(req.result ?? {});
    req.onerror = () => reject(req.error);
  }));
  return { ache: ache ?? '', checklistState: checklistState ?? {} };
}

export async function savePrefs({ ache, checklistState }) {
  const db = await openDB();
  if (!db) {
    if (typeof ache === 'string') writeLocal('cpf_ache', ache);
    if (checklistState && typeof checklistState === 'object') writeLocal('cpf_checklist_state', checklistState);
    return;
  }
  await withStore(STORE_PREFS, 'readwrite', store => {
    if (typeof ache === 'string') store.put(ache, 'ache');
    if (checklistState && typeof checklistState === 'object') store.put(checklistState, 'checklistState');
  });
}

export async function listSessions(limit = 20) {
  const db = await openDB();
  if (!db) {
    const sessions = readLocal('cpf_sessions', []);
    return Array.isArray(sessions) ? sessions.slice(0, limit) : [];
  }
  return withStore(STORE_SESSIONS, 'readonly', store => new Promise((resolve, reject) => {
    const out = [];
    const req = store.openCursor(null, 'prev');
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor && out.length < limit) {
        out.push(cursor.value);
        cursor.continue();
      } else {
        resolve(out);
      }
    };
    req.onerror = () => reject(req.error);
  })) ?? [];
}

export async function saveSession(session) {
  const db = await openDB();
  const normalized = {
    ...session,
    timestamp: session.timestamp ?? new Date().toISOString()
  };
  if (!db) {
    const sessions = readLocal('cpf_sessions', []);
    sessions.unshift(normalized);
    writeLocal('cpf_sessions', sessions.slice(0, 20));
    return normalized;
  }
  await withStore(STORE_SESSIONS, 'readwrite', store => new Promise((resolve, reject) => {
    const req = store.put(normalized);
    req.onsuccess = () => resolve(normalized);
    req.onerror = () => reject(req.error);
  }));
  return normalized;
}

export async function clearAll() {
  const db = await openDB();
  if (!db) {
    localStorage.removeItem('cpf_ache');
    localStorage.removeItem('cpf_checklist_state');
    localStorage.removeItem('cpf_sessions');
    return;
  }
  await Promise.all([
    withStore(STORE_PREFS, 'readwrite', store => new Promise((resolve, reject) => {
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    })),
    withStore(STORE_SESSIONS, 'readwrite', store => new Promise((resolve, reject) => {
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    }))
  ]);
}
