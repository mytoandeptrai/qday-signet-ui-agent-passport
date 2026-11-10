import { useMediaQuery } from '@/hooks/use-media-query';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { cn } from '@/lib/utils';
import { DAY_MOMENTS, HOW_STEPS, INSTALL_COMMAND, INSTALL_PROMPT, PARTNERS, PLATE_IMAGES, SESSION_CARD } from '@/mock/landing';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { SignetPlate } from './signet-plate';

const money = (n: number) => `$${n.toFixed(2)}`;

function Wrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1280px] px-4 md:px-10', className)}>{children}</div>;
}

function TextLink({ to, href, children }: { to?: string; href?: string; children: React.ReactNode }) {
  const cls = 'mt-6 inline-flex gap-[7px] text-[15px] transition-colors hover:text-muted-foreground';
  const body = (
    <>
      {children} <ArrowRight className='size-4' aria-hidden='true' />
    </>
  );
  return to ? (
    <Link to={to} className={cls}>
      {body}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {body}
    </a>
  );
}

export function LogoMarquee() {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className='flex items-center gap-11 px-8 md:gap-16'>
      {PARTNERS.map((p) => (
        <li key={p} className={cn('text-[15px] font-medium tracking-tight whitespace-nowrap text-[#9ea3ad] md:text-[17px]', p === 'x402' && 'font-mono font-normal')}>
          {p}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label='Investors and partners' className='relative z-[4] bg-white pt-8 pb-10 md:pt-11 md:pb-[52px]'>
      <p className='mb-[22px] text-center text-[13px] text-text-3'>Investors &amp; partners</p>
      <div className='group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]'>
        <div className='flex w-max animate-[marquee_70s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none'>
          {row()}
          {row(true)}
        </div>
      </div>
    </section>
  );
}

/** One example session, drawn the way the dashboard shows it; rows land one by one when scrolled into view. */
export function SessionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [revoked, setRevoked] = useState(false);
  const { rows, limit, perCall } = SESSION_CARD;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timers = rows.map((_, i) => window.setTimeout(() => setShown(i + 1), 500 + i * 750));
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, [rows]);

  const spent = rows.slice(0, shown).reduce((s, r) => s + (r.stopped ? 0 : r.amount), 0);

  return (
    <section id='session' className='relative z-[4] bg-white py-12 md:py-20'>
      <Wrap>
        <h2 className='text-center font-display text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-semibold tracking-[-0.016em]'>Set enforceable limits.</h2>
        <div ref={ref} className='relative mt-10 aspect-[.7] md:aspect-[1.75]'>
          <div className='absolute inset-0'>
            <SignetPlate scene='ledger' aspect={1.75} progress={0.75} src={PLATE_IMAGES.session || undefined} label='Daily spending bars rising toward a dashed limit line' />
          </div>
          <div className='absolute top-1/2 left-1/2 w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 rounded-md border bg-white text-sm shadow-[0_1px_2px_rgba(27,30,36,.04),0_12px_40px_rgba(27,30,36,.10)] md:w-[440px]'>
            <div className='flex items-baseline justify-between gap-4 px-6 pt-[22px]'>
              <span className='text-base leading-[1.3] font-medium'>{SESSION_CARD.title}</span>
              <button
                type='button'
                disabled={revoked}
                onClick={() => {
                  setRevoked(true);
                  toast('Session revoked. Remaining balance returned.');
                }}
                className='text-[13px] font-medium text-muted-foreground hover:text-foreground disabled:text-danger'
              >
                {revoked ? 'Revoked' : 'Revoke'}
              </button>
            </div>
            <div className='px-6 pt-[18px] tabular-nums'>
              <div className='flex items-baseline justify-between'>
                <span>
                  <b className='text-xl font-normal'>{money(spent)}</b>
                  <small className='ml-1 text-[13px] text-muted-foreground'>spent</small>
                </span>
                <span>
                  <b className='text-xl font-normal'>{money(limit - spent)}</b>
                  <small className='ml-1 text-[13px] text-muted-foreground'>left</small>
                </span>
              </div>
              <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-border'>
                <i className='block h-full rounded-full bg-brand transition-[width] duration-[600ms]' style={{ width: `${(spent / limit) * 100}%` }} />
              </div>
              <div className='mt-2 flex justify-end gap-3.5 text-xs text-muted-foreground'>
                <span>${limit} limit</span>
                <span>${perCall} per call</span>
              </div>
            </div>
            <div className='px-6 pt-5 pb-1 text-sm font-medium text-muted-foreground'>Activity</div>
            <ul className='m-0 min-h-[162px] list-none px-6 pb-[18px]'>
              {rows.map((r, i) => (
                <li
                  key={r.service}
                  className={cn(
                    'grid h-9 grid-cols-[minmax(0,1fr)_auto_56px] items-center gap-x-4 tabular-nums transition-all duration-300',
                    i < shown ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                  )}
                >
                  <span className={cn('truncate', r.stopped && 'text-muted-foreground')}>{r.service}</span>
                  <span className={cn('text-right text-[13px]', r.stopped && 'text-text-3 line-through')}>{money(r.amount)}</span>
                  <span className={cn('text-right text-[13px] text-muted-foreground', r.stopped && 'text-danger')}>{r.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='mt-10 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-10'>
          {SESSION_CARD.points.map((p) => (
            <div key={p} className='border-t border-foreground pt-4 text-[15px] leading-[1.4]'>
              {p}
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

export function LineSection({ id, text, align = 'left', link }: { id: string; text: string; align?: 'left' | 'right'; link: { label: string; to?: string; href?: string } }) {
  return (
    <section id={id} className='relative z-[4] bg-white py-10 md:py-12'>
      <Wrap className={cn('flex flex-col', align === 'right' ? 'max-md:items-start md:items-end md:text-right' : 'items-start')}>
        <p className='max-w-[720px] font-display text-2xl leading-[1.35] font-semibold text-balance text-muted-foreground'>{text}</p>
        <TextLink to={link.to} href={link.href}>
          {link.label}
        </TextLink>
      </Wrap>
    </section>
  );
}

function CopyCommand() {
  const [done, setDone] = useState(false);
  return (
    <button
      type='button'
      aria-label='Copy the install prompt'
      onClick={() => {
        navigator.clipboard?.writeText(INSTALL_PROMPT).catch(() => undefined);
        toast.success('Install prompt copied');
        setDone(true);
        window.setTimeout(() => setDone(false), 1500);
      }}
      className='flex w-full cursor-pointer items-center gap-2.5 text-left'
    >
      <span className='min-w-0 flex-1 font-mono text-[12.5px] leading-[1.45] tracking-[-0.01em]'>{INSTALL_COMMAND}</span>
      {done ? <Check className='size-4 text-success' /> : <Copy className='size-4 text-muted-foreground' />}
    </button>
  );
}

export function HowSection() {
  const [asked, setAsked] = useState(false);
  const overlays = [
    <CopyCommand key='1' />,
    <div key='2' className='tabular-nums'>
      <div className='flex items-baseline justify-between'>
        <span><b className='text-lg font-normal'>$0.00</b><small className='ml-1 text-[13px] text-muted-foreground'>spent</small></span>
        <span><b className='text-lg font-normal'>$20.00</b><small className='ml-1 text-[13px] text-muted-foreground'>left</small></span>
      </div>
      <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-border'><i className='block h-full w-[1.2%] rounded-full bg-brand' /></div>
      <div className='mt-2 flex justify-end gap-3.5 text-xs text-muted-foreground'><span>$20 limit</span><span>$5 a call</span></div>
    </div>,
    <button key='3' type='button' onClick={() => { setAsked(true); toast('Job sent to your agent'); }} className='cursor-pointer text-left'>
      <div className='mb-2 text-sm leading-[1.4]'>Call six restaurants and find us a private room for 12.</div>
      <div className={cn('flex justify-between gap-3 text-[13px] text-muted-foreground tabular-nums transition-opacity', asked ? 'opacity-100' : 'opacity-70')}>
        <span>StablePhone, 6 calls</span><b className='font-normal text-foreground'>$3.24</b>
      </div>
    </button>,
  ];
  return (
    <section id='how' className='relative z-[4] bg-white py-12 md:py-20'>
      <Wrap>
        <p className='mb-[18px] text-[13px] text-text-3'>How it works</p>
        <h2 className='font-display text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-semibold tracking-[-0.016em]'>Three steps to a first payment.</h2>
        <div className='mt-10 grid gap-14 md:mt-16 md:grid-cols-3 md:gap-10'>
          {HOW_STEPS.map((s, i) => (
            <div key={s.n}>
              <div className='relative aspect-[4/5]'>
                <div className='absolute inset-0'><SignetPlate scene={s.scene} aspect={0.8} progress={s.level} src={PLATE_IMAGES.how[i] || undefined} /></div>
                <div className='absolute inset-x-3 top-1/2 flex h-[104px] -translate-y-1/2 flex-col justify-center rounded-md border bg-white px-3.5 shadow-[0_1px_2px_rgba(27,30,36,.04),0_12px_40px_rgba(27,30,36,.10)]'>
                  {overlays[i]}
                </div>
              </div>
              <h3 className='mt-[22px] flex items-baseline gap-3.5 font-display text-[26px] leading-[1.2] font-semibold'>
                <span className='font-sans text-[13px] text-text-3'>{s.n}</span>
                {s.title}
              </h3>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

const DAY_BUDGET = 50;
const LATTICE = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><path d='M0 48L48 0M-12 12L12-12M36 60L60 36' stroke='white' stroke-opacity='.07' stroke-width='1'/></svg>")}")`;

/** A day on Signet: the section pins and the scroll draws a line through six moments while the day's budget fills. */
export function DaySection() {
  const track = useRef<HTMLDivElement>(null);
  const wide = useMediaQuery('(min-width: 901px)');
  const total = DAY_MOMENTS.length;
  const length = typeof window === 'undefined' ? 1000 : window.innerHeight * 0.7 * total;
  const p = useScrollProgress(track, length, true);
  const now = Math.min(total - 1, Math.floor(p * total));
  const line = Math.min(1, (p * total) / (total - 1));
  const visible = DAY_MOMENTS.slice(0, now + 1);
  const spent = visible.reduce((n, m) => n + (m.stopped ? 0 : (m.amount ?? 0)), 0);
  const stopped = visible.filter((m) => m.stopped).length;

  return (
    <section id='day' ref={track} className='relative z-[4] bg-white' style={{ height: `calc(100vh + ${total} * 70vh)` }}>
      <div className='sticky top-0 flex h-screen items-center'>
        <Wrap>
          <h2 className='font-display text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-semibold tracking-[-0.016em]'>A day on Signet.</h2>
          <div
            role='img'
            aria-label='A timeline of six payments across one day, with the daily budget filling as each one lands'
            className='relative mt-12 aspect-[.9] overflow-hidden rounded-3xl bg-[#0a1a4a] text-[#f5f7f9] md:aspect-[2.5]'
            style={{ backgroundImage: `radial-gradient(70% 90% at 12% 0%, rgba(31,102,255,.55), transparent 70%), radial-gradient(60% 70% at 100% 100%, rgba(2,121,169,.35), transparent 70%), ${LATTICE}` }}
          >
            <div className='absolute inset-x-7 top-7 max-md:inset-x-5 max-md:top-5'>
              <div className='flex items-end justify-between gap-4'>
                <div>
                  <div className='text-[13px] text-[#f5f7f9]/70'>Spent today</div>
                  <div className='mt-1 font-display text-[clamp(30px,3.4vw,48px)] leading-none font-semibold tabular-nums'>${spent.toFixed(2)}<span className='ml-2 text-[15px] font-normal text-[#f5f7f9]/60'>of ${DAY_BUDGET} budget</span></div>
                </div>
                <div className={cn('rounded-full border px-3 py-1 text-[13px] transition-colors duration-500', stopped ? 'border-[#f0ada7]/60 bg-[#f0ada7]/15 text-[#f0ada7]' : 'border-white/20 text-[#f5f7f9]/70')}>
                  {stopped ? `${stopped} stopped at your limit` : 'All within limits'}
                </div>
              </div>
              <div className='mt-5 h-1.5 overflow-hidden rounded-full bg-white/15'>
                <div className='h-full origin-left rounded-full bg-gradient-to-r from-[#6ea1ff] to-[#8ecaed] transition-transform duration-500 ease-out' style={{ transform: `scaleX(${spent / DAY_BUDGET})` }} />
              </div>
            </div>

            <div className='absolute inset-x-7 bottom-7 max-md:inset-x-5 max-md:bottom-5'>
              {wide && (
                <div className='pointer-events-none absolute top-[5px] left-0 h-px w-[calc(83.333%+20px)] bg-white/20'>
                  <div className='h-full origin-left bg-[#8ecaed] will-change-transform' style={{ transform: `scaleX(${line})` }} />
                </div>
              )}
              <ol className='grid grid-cols-6 gap-6 max-[900px]:grid-cols-1'>
                {DAY_MOMENTS.map((m, i) => (
                  <li key={m.time} className={cn('relative pt-6 transition-opacity duration-500', i === now ? 'opacity-100' : i < now ? 'opacity-75' : 'opacity-40', !wide && i !== now && 'hidden')}>
                    {wide && (
                      <span className={cn('absolute top-0 left-0 size-[11px] rounded-full transition-all duration-500', i > now ? 'bg-white/30' : m.stopped ? 'bg-[#f0ada7]' : 'bg-[#8ecaed]', i === now && 'scale-125 shadow-[0_0_0_6px_rgba(142,202,237,.2)]', i === now && m.stopped && 'shadow-[0_0_0_6px_rgba(240,173,167,.25)]')} />
                    )}
                    <div className='text-[13px] tabular-nums text-[#f5f7f9]/70'>{m.time}</div>
                    <div className='mt-1.5 font-display text-lg leading-[1.3] md:text-[19px]'>{m.text}</div>
                    <div className={cn('mt-2 text-[13px]', m.stopped ? 'text-[#f0ada7]' : 'text-[#8ecaed]')}>
                      {m.stopped ? `Stopped: $${m.amount?.toFixed(2)} is over your limit` : `${m.service} · $${m.amount?.toFixed(2)}`}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Wrap>
      </div>
    </section>
  );
}

export function ClosingSection() {
  return (
    <section className='relative z-[4] bg-white pt-16 pb-12 text-center md:pt-24 md:pb-20'>
      <Wrap>
        <h2 className='mb-9 font-display text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-semibold tracking-[-0.016em]'>Give your agent a Signet.</h2>
        <Link
          to='/login'
          search={{ redirect: '/overview' }}
          className='inline-flex h-11 w-[140px] items-center justify-center text-[15px] font-medium rounded-full bg-primary sheen text-primary-foreground shadow-primary transition-all hover:brightness-110'
        >
          Get started
        </Link>
        <div className='relative mt-14 aspect-[1.6] md:aspect-[3.4]'>
          <SignetPlate scene='orbit' aspect={3.4} src={PLATE_IMAGES.close || undefined} label='Rings of services orbiting the Signet mark' />
        </div>
      </Wrap>
    </section>
  );
}
