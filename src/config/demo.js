// Public portfolio flag. Set EXPO_PUBLIC_DEMO=1 at build time.
// Expo inlines EXPO_PUBLIC_* into the web bundle, so the static export
// never depends on a runtime server variable.
export const IS_DEMO =
  process.env.EXPO_PUBLIC_DEMO === '1' ||
  process.env.EXPO_PUBLIC_DEMO === 'true';
