import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeToken, storeUser, getStoredToken } from '../utils/auth';
import { DEMO_TOKEN, createSeedState } from './data';

const STORAGE_KEY = 'cyna_demo_state_v1';

let state = null;
let hydratePromise = null;

function cloneSeed() {
  return createSeedState();
}

function canUseLocalStorage() {
  try {
    return typeof localStorage !== 'undefined' && localStorage !== null;
  } catch {
    return false;
  }
}

async function readRaw() {
  try {
    if (canUseLocalStorage()) {
      return localStorage.getItem(STORAGE_KEY);
    }
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[demo] lecture locale impossible', error);
    return null;
  }
}

async function writeRaw(raw) {
  try {
    if (canUseLocalStorage()) {
      localStorage.setItem(STORAGE_KEY, raw);
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEY, raw);
  } catch (error) {
    console.warn('[demo] écriture locale impossible', error);
  }
}

function isUsable(parsed) {
  return Boolean(
    parsed &&
      parsed.version === 1 &&
      parsed.user &&
      Array.isArray(parsed.cart) &&
      Array.isArray(parsed.orders) &&
      Array.isArray(parsed.companies) &&
      Array.isArray(parsed.invitations) &&
      parsed.consent
  );
}

async function hydrate() {
  const raw = await readRaw();
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (isUsable(parsed)) {
        state = parsed;
        if (!Array.isArray(state.messages)) state.messages = [];
        if (typeof state.seq !== 'number') state.seq = 100;
        return state;
      }
    } catch (error) {
      console.warn('[demo] état local ignoré', error);
    }
  }
  state = cloneSeed();
  await persistDemoState();
  return state;
}

export function getDemoState() {
  if (!hydratePromise) {
    hydratePromise = hydrate();
  }
  return hydratePromise;
}

export async function persistDemoState() {
  if (!state) return;
  await writeRaw(JSON.stringify(state));
}

export function resetDemoState() {
  const fresh = cloneSeed();
  if (!state) {
    state = fresh;
    return state;
  }
  Object.keys(state).forEach((key) => {
    delete state[key];
  });
  Object.assign(state, fresh);
  return state;
}

// Cold start of the public demo: a fictional session, stored only on device.
export async function ensureDemoSession() {
  const current = await getDemoState();
  const token = await getStoredToken();
  if (!token) {
    await storeToken(DEMO_TOKEN);
    await storeUser(current.user);
  }
  return current;
}

export async function syncDemoUser(user) {
  if (user) {
    await storeUser(user);
  }
}
