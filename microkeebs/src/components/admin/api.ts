const configuredApiBase = import.meta.env.VITE_API_BASE?.trim();

export const API_BASE = configuredApiBase
  ? configuredApiBase.replace(/\/$/, '')
  : '';

export function getApiUrl(path: string) {
  return `${API_BASE}${path}`;
}

export function adminFetch(path: string, init: RequestInit = {}) {
  return fetch(getApiUrl(path), {
    ...init,
    credentials: 'include',
  });
}

export function getBuildImagePath(buildId: string, index: number) {
  const fileName = index === 0 ? 'thumbnail' : String(index);
  return `./images/${buildId}/${fileName}.webp`;
}
