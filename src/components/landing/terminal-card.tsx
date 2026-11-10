const LINES: { text: string; tone?: 'dim' | 'ok' | 'stop' }[] = [
  { text: '$ signet session create --task "Team dinner" --limit 20 --per-call 5', tone: 'dim' },
  { text: 'Session ses_team_dinner is live. $20.00 held.', tone: 'ok' },
  { text: '→ StablePhone · 6 calls · $3.24', tone: 'ok' },
  { text: '→ AgentRes · booking for 12 · $0.01', tone: 'ok' },
  { text: '→ Amazon · table flowers · $48.00', tone: 'stop' },
  { text: 'Stopped: over the $20 session limit.', tone: 'stop' },
];

/** The terminal that rises over the print; `reveal` (0..1) types its lines in. */
export function TerminalCard({ reveal }: { reveal: number }) {
  const shown = Math.ceil(reveal * LINES.length);
  return (
    <div className='h-full overflow-hidden rounded-md border bg-white shadow-[0_1px_2px_rgba(18,17,16,.04),0_24px_64px_rgba(18,17,16,.12)]'>
      <div className='flex items-center gap-1.5 border-b px-4 py-3'>
        <span className='size-2.5 rounded-full bg-border' />
        <span className='size-2.5 rounded-full bg-border' />
        <span className='size-2.5 rounded-full bg-border' />
        <span className='ml-3 font-mono text-xs text-text-3'>signet</span>
      </div>
      <div className='space-y-2 p-5 font-mono text-[12.5px] leading-[1.55]'>
        {LINES.slice(0, shown).map((l) => (
          <p key={l.text} className={l.tone === 'stop' ? 'text-danger' : l.tone === 'ok' ? 'text-foreground' : 'text-muted-foreground'}>
            {l.text}
          </p>
        ))}
      </div>
    </div>
  );
}
