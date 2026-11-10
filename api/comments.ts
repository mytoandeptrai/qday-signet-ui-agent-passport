import { z } from 'zod';
import type { CommentList, PinComment, Reply } from '../src/lib/comments-api';

/**
 * Vercel function behind /api/comments. One GitHub issue per comment, labelled `ui-comment`:
 *  - open issue            → open comment
 *  - closed as completed   → resolved comment
 *  - closed as not planned → deleted comment (the REST API cannot delete issues)
 * Replies are ordinary comments on that issue. GITHUB_TOKEN never leaves the server.
 * Without GITHUB_TOKEN the list reports `configured: false` and the app stores pins locally.
 */

const LABEL = 'ui-comment';
const MARKER = 'signet-comment';
const MAX_PAGES = 3;

const createSchema = z.object({
  route: z.string().min(1).max(300),
  selector: z.string().min(1).max(600),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  text: z.string().trim().min(1).max(2000),
});
const id = z.string().regex(/^\d+$/);
const bodySchema = z.discriminatedUnion('op', [
  createSchema.extend({ op: z.literal('create') }),
  z.object({ op: z.literal('resolve'), id, resolved: z.boolean() }),
  z.object({ op: z.literal('delete'), id }),
  z.object({ op: z.literal('reply'), id, text: z.string().trim().min(1).max(2000) }),
]);

type GithubIssue = {
  number: number;
  body: string | null;
  state: 'open' | 'closed';
  state_reason?: string | null;
  html_url: string;
  created_at: string;
  comments: number;
  labels: Array<string | { name?: string }>;
  pull_request?: unknown;
};
type GithubReply = { id: number; body: string | null; created_at: string; html_url: string };

function config() {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) return null;
  return { token, repo: process.env.GITHUB_REPO?.trim() || 'mytoandeptrai/qday-signet-ui-agent-passport' };
}

async function github<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cfg = config();
  if (!cfg) throw new Error('GITHUB_TOKEN is not set');
  const response = await fetch(`https://api.github.com/repos/${cfg.repo}${path}`, {
    ...init,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${cfg.token}`,
      'content-type': 'application/json',
      'user-agent': 'signet-ui-comments',
      'x-github-api-version': '2022-11-28',
    },
  });
  if (!response.ok) throw new Error(`GitHub ${response.status} on ${init.method ?? 'GET'} ${path}`);
  return (await response.json()) as T;
}

// The metadata rides in an HTML comment so the issue body stays readable on GitHub.
// "<" and ">" are escaped so user text can never close the comment early.
function encodeMeta(meta: z.infer<typeof createSchema>) {
  const json = JSON.stringify(meta).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
  return `<!-- ${MARKER} ${json} -->`;
}

function decodeMeta(body: string | null) {
  const match = body?.match(new RegExp(`<!-- ${MARKER} (\\{.*\\}) -->`));
  if (!match?.[1]) return null;
  const parsed = createSchema.safeParse(JSON.parse(match[1]));
  return parsed.success ? parsed.data : null;
}

function toComment(issue: GithubIssue): PinComment | null {
  let meta: ReturnType<typeof decodeMeta> = null;
  try {
    meta = decodeMeta(issue.body);
  } catch {
    return null;
  }
  if (!meta || issue.pull_request) return null;
  if (issue.state === 'closed' && issue.state_reason === 'not_planned') return null;
  return {
    id: String(issue.number),
    ...meta,
    resolved: issue.state === 'closed',
    createdAt: Date.parse(issue.created_at),
    url: issue.html_url,
    replies: issue.comments,
  };
}

const toReply = (reply: GithubReply): Reply => ({
  id: String(reply.id),
  text: reply.body ?? '',
  createdAt: Date.parse(reply.created_at),
  url: reply.html_url,
});

// Zero-width space after "@" so a comment never pings people on GitHub.
const noPing = (text: string) => text.replace(/@/g, '@\u200b');

function issueBody(meta: z.infer<typeof createSchema>) {
  return [
    encodeMeta(meta),
    '',
    noPing(meta.text),
    '',
    '---',
    `Route: \`${meta.route}\``,
    `Element: \`${meta.selector.replace(/`/g, "'")}\``,
    `Position: ${Math.round(meta.x * 100)}% / ${Math.round(meta.y * 100)}%`,
    '',
    '_Created from the Signet UI comment tool._',
  ].join('\n');
}

async function assertCommentIssue(issueId: string) {
  const issue = await github<GithubIssue>(`/issues/${issueId}`);
  const isComment = issue.labels.some((l) => (typeof l === 'string' ? l : l.name) === LABEL);
  // These endpoints must never touch unrelated issues or pull requests.
  if (!isComment || issue.pull_request) throw new Error('Not a UI comment');
}

async function list(): Promise<CommentList> {
  if (!config()) return { configured: false, comments: [] };
  const comments: PinComment[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const issues = await github<GithubIssue[]>(`/issues?labels=${LABEL}&state=all&per_page=100&page=${page}`);
    for (const issue of issues) {
      const comment = toComment(issue);
      if (comment) comments.push(comment);
    }
    if (issues.length < 100) break;
  }
  return { configured: true, comments };
}

async function run(request: Request): Promise<unknown> {
  if (request.method === 'GET') {
    const replies = new URL(request.url).searchParams.get('replies');
    if (!replies) return list();
    const parsed = id.parse(replies);
    await assertCommentIssue(parsed);
    return (await github<GithubReply[]>(`/issues/${parsed}/comments?per_page=100`)).map(toReply);
  }
  const body = bodySchema.parse(await request.json());
  switch (body.op) {
    case 'create': {
      const title = `UI comment: ${body.text.replace(/\s+/g, ' ').slice(0, 70)}`;
      const issue = await github<GithubIssue>('/issues', {
        method: 'POST',
        body: JSON.stringify({ title, body: issueBody(body), labels: [LABEL] }),
      });
      const comment = toComment(issue);
      if (!comment) throw new Error('GitHub returned an unreadable issue');
      return comment;
    }
    case 'resolve':
    case 'delete': {
      await assertCommentIssue(body.id);
      const patch =
        body.op === 'delete'
          ? { state: 'closed', state_reason: 'not_planned' }
          : body.resolved
            ? { state: 'closed', state_reason: 'completed' }
            : { state: 'open', state_reason: 'reopened' };
      await github(`/issues/${body.id}`, { method: 'PATCH', body: JSON.stringify(patch) });
      return { ok: true };
    }
    case 'reply': {
      await assertCommentIssue(body.id);
      return toReply(await github<GithubReply>(`/issues/${body.id}/comments`, { method: 'POST', body: JSON.stringify({ body: noPing(body.text) }) }));
    }
  }
}

async function handle(request: Request) {
  try {
    return Response.json(await run(request));
  } catch (error) {
    const status = error instanceof z.ZodError ? 400 : 502;
    return Response.json({ error: error instanceof Error ? error.message : 'Failed' }, { status });
  }
}

export const GET = handle;
export const POST = handle;
