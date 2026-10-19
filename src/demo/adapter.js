import axios from 'axios';
import { dispatchDemoRequest, DemoHttpError } from './router';
import { getDemoState, persistDemoState, syncDemoUser } from './store';

function parseBody(data) {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  if (typeof data === 'object') return data;
  return {};
}

function parseQuery(url = '') {
  const value = String(url);
  const queryIndex = value.indexOf('?');
  if (queryIndex < 0) return {};
  const params = {};
  value
    .slice(queryIndex + 1)
    .split('&')
    .forEach((part) => {
      if (!part) return;
      const [rawKey, rawValue = ''] = part.split('=');
      try {
        params[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue);
      } catch {
        params[rawKey] = rawValue;
      }
    });
  return params;
}

export function normalizePath(url = '', baseURL = '') {
  let path = String(url || '');
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      path = new URL(path).pathname;
    } catch {
      // Keep the raw value below.
    }
  } else if (baseURL && path.startsWith(baseURL)) {
    path = path.slice(baseURL.length);
  }
  const queryIndex = path.indexOf('?');
  if (queryIndex >= 0) path = path.slice(0, queryIndex);
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  if (path.startsWith('/api/')) path = path.slice(4);
  return path || '/';
}

let chain = Promise.resolve();

async function handle(config) {
  const state = await getDemoState();
  const method = String(config.method || 'get').toUpperCase();
  const path = normalizePath(config.url, config.baseURL);
  const params = { ...parseQuery(config.url), ...(config.params || {}) };
  const body = parseBody(config.data);

  console.info(`[demo] ${method} ${path}`);

  try {
    const data = dispatchDemoRequest(state, { method, path, body, params });
    if (method !== 'GET') {
      await persistDemoState();
    }
    if (method === 'PUT' && path === '/user/profile') {
      await syncDemoUser(data);
    }
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      request: { demo: true },
    };
  } catch (error) {
    const status = error instanceof DemoHttpError ? error.status : error.status || 500;
    const message = error.message || 'Erreur de la démo locale';
    throw new axios.AxiosError(
      message,
      axios.AxiosError.ERR_BAD_REQUEST,
      config,
      { demo: true },
      {
        status,
        statusText: 'Error',
        headers: {},
        config,
        data: { error: message, message },
      }
    );
  }
}

export function demoAdapter(config) {
  const run = chain.then(() => handle(config));
  chain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}
