import type { CommentList, NewComment, PinComment, Reply } from './types';

const ENDPOINT = '/api/comments';

const call = async <T>(init?: RequestInit, query = ''): Promise<T> => {
  const response = await fetch(`${ENDPOINT}${query}`, init);
  if (!response.ok) throw new Error(`Comments API ${response.status}`);
  return (await response.json()) as T;
};

const post = <T>(body: object) =>
  call<T>({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

export const getCommentList = async (): Promise<CommentList> => {
  try {
    return await call<CommentList>();
  } catch {
    // No function behind /api (plain `vite` dev server): behave as "no token".
    if (import.meta.env.DEV) return { configured: false, comments: [] };
    throw new Error('Comments API unavailable');
  }
};

export const createComment = (data: NewComment) => post<PinComment>({ op: 'create', ...data });

export const setCommentResolved = (id: string, resolved: boolean) => post<{ ok: true }>({ op: 'resolve', id, resolved });

export const deleteComment = (id: string) => post<{ ok: true }>({ op: 'delete', id });

export const getReplyList = (id: string) => call<Reply[]>(undefined, `?replies=${id}`);

export const createReply = (id: string, text: string) => post<Reply>({ op: 'reply', id, text });
