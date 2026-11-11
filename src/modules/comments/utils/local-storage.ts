import type { PinComment } from '@/apis/comments';

export const STORAGE_KEY = 'trellis-comments-v1';

export const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const loadLocal = (): PinComment[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c): c is PinComment =>
        !!c &&
        typeof c.id === 'string' &&
        typeof c.route === 'string' &&
        typeof c.selector === 'string' &&
        typeof c.text === 'string'
    );
  } catch {
    return [];
  }
};

export const saveLocal = (list: PinComment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* Persistence is optional. */
  }
};
