export const publicationStorageKey = 'termite-treatment:content-published';

export function announcePublication(path: string) {
  // A saved database write must still count as success if storage is disabled.
  try { window.localStorage.setItem(publicationStorageKey, JSON.stringify({ path, at: Date.now() })); }
  catch { /* Returning to a public tab also refreshes its content. */ }
}
