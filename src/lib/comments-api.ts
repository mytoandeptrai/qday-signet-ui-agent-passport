/**
 * Review comments are stored as GitHub Issues by the `/api/comments` function (api/comments.ts),
 * which keeps the token on the server. Without that function (local dev) or without a token,
 * `listComments` reports `configured: false` and the store falls back to this browser only.
 */

export type PinComment = {
  id: string;
  route: string;
  /** CSS selector of the element the comment is attached to. */
  selector: string;
  /** Click position inside that element, as a 0–1 fraction of its width/height. */
  x: number;
  y: number;
  text: string;
  resolved: boolean;
  createdAt: number;
  /** Set for comments stored on GitHub. */
  url?: string;
  /** Number of replies on the GitHub issue. */
  replies?: number;
};

export type Reply = { id: string; text: string; createdAt: number; url: string };

export type CommentList = { configured: boolean; comments: PinComment[] };

const ENDPOINT = '/api/comments';

async function call<T>(init?: RequestInit, query = ''): Promise<T> {
  const response = await fetch(`${ENDPOINT}${query}`, init);
  if (!response.ok) throw new Error(`Comments API ${response.status}`);
  return (await response.json()) as T;
}

const post = <T>(body: object) =>
  call<T>({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

export async function listComments(): Promise<CommentList> {
  try {
    return await call<CommentList>();
  } catch {
    // No function behind /api (plain `vite` dev server): behave as "no token".
    if (import.meta.env.DEV) return { configured: false, comments: [] };
    throw new Error('Comments API unavailable');
  }
}

export const createComment = ({ data }: { data: Pick<PinComment, 'route' | 'selector' | 'x' | 'y' | 'text'> }) =>
  post<PinComment>({ op: 'create', ...data });

export const setCommentResolved = ({ data }: { data: { id: string; resolved: boolean } }) => post<{ ok: true }>({ op: 'resolve', ...data });

export const deleteComment = ({ data }: { data: { id: string } }) => post<{ ok: true }>({ op: 'delete', ...data });

export const listReplies = ({ data }: { data: { id: string } }) => call<Reply[]>(undefined, `?replies=${data.id}`);

export const createReply = ({ data }: { data: { id: string; text: string } }) => post<Reply>({ op: 'reply', ...data });
