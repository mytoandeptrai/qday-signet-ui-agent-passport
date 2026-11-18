export type PinComment = {
  id: string;
  route: string;
  selector: string;
  x: number;
  y: number;
  text: string;
  resolved: boolean;
  createdAt: number;
  url?: string;
  replies?: number;
};

export type Reply = { id: string; text: string; createdAt: number; url: string };

export type CommentList = { configured: boolean; comments: PinComment[] };

export type NewComment = Pick<PinComment, 'route' | 'selector' | 'x' | 'y' | 'text'>;
