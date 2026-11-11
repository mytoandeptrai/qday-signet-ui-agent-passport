/**
 * Review comments are stored as GitHub Issues by the `/api/comments` function (api/comments.ts),
 * which keeps the token on the server.
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

export type NewComment = Pick<PinComment, 'route' | 'selector' | 'x' | 'y' | 'text'>;
