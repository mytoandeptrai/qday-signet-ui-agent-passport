import { useMediaQuery } from '@/hooks/use-media-query';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { HERO_WORDS, LANDING_LIGHT, PLATE_IMAGES } from '@/mock/landing';
import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { InstallButton } from './install-button';
import { RisoPlate } from './riso-plate';
import { SiteHeader } from './site-header';
import { TerminalCard } from './terminal-card';

const PIN_LENGTH = 1100;

function RotatingWord() {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (i >= HERO_WORDS.length - 1) return;
    const t = window.setTimeout(() => {
      setOut(true);
      window.setTimeout(() => {
        setI((n) => n + 1);
        setOut(false);
      }, 420);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [i]);
  return <span className={`inline-block text-text-3 transition-all duration-[420ms] ${out ? 'translate-y-[0.12em] opacity-0' : ''}`}>{HERO_WORDS[i]}</span>;
}

export function Hero() {
  const track = useRef<HTMLDivElement>(null);
  const wide = useMediaQuery('(min-width: 1024px)');
  const p = useScrollProgress(track, PIN_LENGTH, wide);
  const sun = wide ? 0.08 + 0.84 * (1 - (1 - p) ** 2) : 0.8;
  const rise = Math.min(1, Math.max(0, (p - 0.55) / 0.45));

  return (
    <div ref={track} id='top' style={wide ? { height: `calc(100vh + ${PIN_LENGTH}px)` } : undefined}>
      <div className='relative overflow-x-clip lg:sticky lg:top-0 lg:h-screen lg:min-h-[640px]'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]'
          style={{
            opacity: Math.min(1, sun * 1.15),
            background: `radial-gradient(70% 75% at 78% 52%, rgba(${LANDING_LIGHT.spill}, .55), rgba(${LANDING_LIGHT.spill}, .18) 55%, transparent 80%)`,
          }}
        />
        <SiteHeader overlay />
        <div className='mx-auto flex h-full max-w-[1280px] flex-col px-4 pt-[calc(56px+40px)] pb-6 md:px-10 lg:flex-row lg:items-center lg:gap-16 lg:pt-16 lg:pb-0'>
          <div className='relative z-[3] lg:w-1/2'>
            <h1 className='font-serif text-[clamp(34px,9.4vw,44px)] leading-[1.14] font-light tracking-[-0.018em] md:text-[clamp(40px,3.75vw,56px)]'>
              <span className='sr-only'>Let your agents pay for shopping, APIs and leads</span>
              <span aria-hidden='true' className='block lg:whitespace-nowrap'>Let your agents pay for</span>
              <span aria-hidden='true' className='block'>
                <RotatingWord />
              </span>
            </h1>
            <p className='mt-7 max-w-[440px] text-base leading-[1.6] text-muted-foreground'>
              Signet gives your agent a balance it can spend across 2,000+ services, strictly within the limits you set.
            </p>
            <div className='relative mt-9 flex flex-wrap items-center gap-3 max-md:flex-col max-md:items-stretch'>
              <Link
                to='/login'
                search={{ redirect: '/overview' }}
                className='inline-flex h-11 w-[140px] items-center justify-center text-[15px] font-medium text-brand shadow-[inset_0_0_0_1.5px_var(--brand)] transition-colors hover:bg-brand/[.07] hover:text-brand-hover max-md:w-full'
              >
                Get started
              </Link>
              <InstallButton />
            </div>
          </div>

          <div className='relative mt-10 aspect-square w-full lg:mt-0 lg:w-1/2 lg:max-w-[min(640px,80vh)]'>
            <div className='absolute inset-0 overflow-hidden'>
              <RisoPlate sun={sun} src={PLATE_IMAGES.hero || undefined} label='A riso print of the sun rising over the sea' />
            </div>
            {wide && (
              <div
                className='absolute inset-x-6 bottom-6 z-[5] h-[62%]'
                style={{ opacity: rise, transform: `translateY(${(1 - rise) * 65}%)` }}
              >
                <TerminalCard reveal={rise} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
