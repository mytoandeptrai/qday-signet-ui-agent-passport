import { useMediaQuery } from '@/hooks/use-media-query';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { cn } from '@/lib/utils';
import { DAY_MOMENTS, HOW_STEPS, INSTALL_COMMAND, INSTALL_PROMPT, LANDING_LIGHT, PARTNERS, PLATE_IMAGES, SESSION_CARD } from '@/mock/landing';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { RisoPlate } from './riso-plate';

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
        <li key={p} className={cn('text-[15px] font-medium tracking-tight whitespace-nowrap text-[#aaa59c] md:text-[17px]', p === 'x402' && 'font-mono font-normal')}>
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
    <section id='session' className='relative z-[4] bg-white py-[72px] md:py-[140px]'>
      <Wrap>
        <h2 className='text-center font-serif text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-light tracking-[-0.016em]'>Set enforceable limits.</h2>
        <div ref={ref} className='relative mt-14 aspect-[.7] md:aspect-[1.75]'>
          <div className='absolute inset-0 overflow-hidden'>
            <RisoPlate sun={0.3} src={PLATE_IMAGES.session || undefined} label='A riso print of a calm sea at dusk' />
          </div>
          <div className='absolute top-1/2 left-1/2 w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 rounded-md border bg-white text-sm shadow-[0_1px_2px_rgba(18,17,16,.04),0_12px_40px_rgba(18,17,16,.10)] md:w-[440px]'>
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
    <section id={id} className='relative z-[4] bg-white py-16 md:pt-16 md:pb-[72px]'>
      <Wrap className={cn('flex flex-col', align === 'right' ? 'max-md:items-start md:items-end md:text-right' : 'items-start')}>
        <p className='max-w-[720px] font-serif text-2xl leading-[1.35] font-light text-balance text-muted-foreground'>{text}</p>
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
    <section id='how' className='relative z-[4] bg-white py-[72px] md:py-[140px]'>
      <Wrap>
        <p className='mb-[18px] text-[13px] text-text-3'>How it works</p>
        <h2 className='font-serif text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-light tracking-[-0.016em]'>Three steps to a first payment.</h2>
        <div className='mt-10 grid gap-14 md:mt-16 md:grid-cols-3 md:gap-10'>
          {HOW_STEPS.map((s, i) => (
            <div key={s.n}>
              <div className='relative aspect-[4/5]'>
                <div className='absolute inset-0 overflow-hidden'><RisoPlate sun={s.sun} src={PLATE_IMAGES.how[i] || undefined} /></div>
                <div className='absolute inset-x-3 top-1/2 flex h-[104px] -translate-y-1/2 flex-col justify-center rounded-md border bg-white px-3.5 shadow-[0_1px_2px_rgba(18,17,16,.04),0_12px_40px_rgba(18,17,16,.10)]'>
                  {overlays[i]}
                </div>
              </div>
              <h3 className='mt-[22px] flex items-baseline gap-3.5 font-serif text-[26px] leading-[1.2] font-light'>
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

/** A day on Signet: the section pins and the scroll walks through six moments under a rising moon. */
export function DaySection() {
  const track = useRef<HTMLDivElement>(null);
  const wide = useMediaQuery('(min-width: 901px)');
  const total = DAY_MOMENTS.length;
  const length = typeof window === 'undefined' ? 1000 : window.innerHeight * 0.7 * total;
  const p = useScrollProgress(track, length, true);
  const now = Math.min(total - 1, Math.floor(p * total));
  const settled = DAY_MOMENTS.slice(0, now + 1).filter((m) => !m.stopped).length;
  const moon = Math.sin(Math.PI * Math.min(1, ((p * total) % 1) * 0.9 + 0.05)) * 0.9;

  return (
    <section id='day' ref={track} className='relative z-[4] bg-white' style={{ height: `calc(100vh + ${total} * 70vh)` }}>
      <div className='sticky top-0 flex h-screen items-center'>
        <Wrap>
          <h2 className='font-serif text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-light tracking-[-0.016em]'>A day on Signet.</h2>
          <div className='relative mt-12 aspect-[.9] md:aspect-[2.5]'>
            <div className='absolute inset-0 overflow-hidden'><RisoPlate variant='night' sun={moon} src={PLATE_IMAGES.day || undefined} label='A riso print of the sea at night, a moon rising behind each moment' /></div>
            <div className='absolute inset-0 overflow-hidden text-[#f4f1ea] [text-shadow:0_0_10px_rgba(24,38,70,.9)]'>
              <div className='absolute top-6 left-7 flex gap-2.5 text-[13px] text-[#f4f1ea]/80 max-md:left-4'>
                <span>{settled} payments</span><span aria-hidden>·</span><span>{DAY_MOMENTS.filter((m) => m.stopped && DAY_MOMENTS.indexOf(m) <= now).length} stopped</span>
              </div>
              <ol className='absolute inset-x-7 bottom-[34%] grid grid-cols-6 gap-6 pb-[18px] max-[900px]:inset-x-4 max-[900px]:grid-cols-1'>
                {DAY_MOMENTS.map((m, i) => (
                  <li key={m.time} className={cn('relative transition-opacity duration-500', i === now ? 'opacity-100' : i < now ? 'opacity-80' : 'opacity-50', !wide && i !== now && 'hidden')}>
                    <div className='text-[13px] tabular-nums text-[#f4f1ea]/85'>{m.time}</div>
                    <div className='mt-1.5 font-serif text-xl leading-[1.3]'>{m.text}</div>
                    <div className={cn('mt-2 text-[13px] text-[#f4f1ea]/85', m.stopped && 'text-[#f5a07a]')}>{m.stopped ? 'Stopped at your limit' : m.service}</div>
                    {wide && <span className='absolute -bottom-[22px] left-0 h-2 w-px bg-[#f4f1ea]/55' />}
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
    <section className='relative z-[4] bg-white pt-24 text-center md:pt-[180px]' style={{ backgroundImage: `radial-gradient(60% 45% at 0% 100%, rgba(${LANDING_LIGHT.closing}, .45), transparent 70%)` }}>
      <Wrap>
        <h2 className='mb-9 font-serif text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-light tracking-[-0.016em]'>Give your agent a Signet.</h2>
        <Link
          to='/login'
          search={{ redirect: '/overview' }}
          className='inline-flex h-11 w-[140px] items-center justify-center text-[15px] font-medium text-ink-blue shadow-[inset_0_0_0_1.5px_var(--ink-blue)] transition-colors hover:bg-ink-blue/[.07]'
        >
          Get started
        </Link>
        <div className='relative mt-24 aspect-[1.6] overflow-hidden md:aspect-[3.4]'>
          <RisoPlate variant='night' sun={0.55} src={PLATE_IMAGES.close || undefined} label='A riso print of night hills under a full moon' />
        </div>
      </Wrap>
    </section>
  );
}
