const BLOCKED_HOSTS = [
  'cyna-store-web.vercel.app',
  'api.stripe.com',
  'checkout.stripe.com',
  'js.stripe.com',
  'm.stripe.network',
  'hooks.stripe.com',
];

function requestUrl(input) {
  if (typeof input === 'string') return input;
  if (input && typeof input.url === 'string') return input.url;
  return '';
}

export function isBlockedDemoUrl(url) {
  const value = String(url || '').toLowerCase();
  return BLOCKED_HOSTS.some((host) => value.includes(host));
}

function blockedError(url) {
  return new Error(`Mode démo : appel réseau bloqué (${url})`);
}

export function installDemoNetworkGuard() {
  const root = typeof globalThis !== 'undefined' ? globalThis : undefined;
  if (!root || root.__cynaDemoNetworkGuard) return;
  root.__cynaDemoNetworkGuard = true;

  if (typeof root.fetch === 'function') {
    const originalFetch = root.fetch.bind(root);
    root.fetch = (input, init) => {
      const url = requestUrl(input);
      if (isBlockedDemoUrl(url)) {
        return Promise.reject(blockedError(url));
      }
      return originalFetch(input, init);
    };
  }

  if (typeof root.XMLHttpRequest !== 'undefined') {
    const originalOpen = root.XMLHttpRequest.prototype.open;
    root.XMLHttpRequest.prototype.open = function open(method, url, ...rest) {
      if (isBlockedDemoUrl(url)) {
        throw blockedError(url);
      }
      return originalOpen.call(this, method, url, ...rest);
    };
  }
}
