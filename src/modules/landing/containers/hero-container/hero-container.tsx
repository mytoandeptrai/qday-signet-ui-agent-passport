import { Link } from '@tanstack/react-router';
import { SignetPlate } from '@/components/brand/signet-plate';
import { PublicHeader } from '@/components/layouts';
import { ROUTES } from '@/constant';
import { InstallButtonUi, RotatingWordUi, TerminalCardUi } from '../../components';
import { HERO_PIN_LENGTH } from '../../utils';
import { useHeroContainer } from '../../hooks';

const HeroContainer = () => {
  const { t, track, isWide, sun, rise, spill, plateSrc, words } = useHeroContainer();

  return (
    <div ref={track} id='top' style={isWide ? { height: `calc(100vh + ${HERO_PIN_LENGTH}px)` } : undefined}>
      <div className='relative overflow-x-clip lg:sticky lg:top-0 lg:h-screen lg:min-h-[640px]'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]'
          style={{
            opacity: Math.min(1, sun * 1.15),
            background: `radial-gradient(70% 75% at 78% 52%, rgba(${spill}, .55), rgba(${spill}, .18) 55%, transparent 80%)`,
          }}
        />
        <PublicHeader overlay />
        <div className='mx-auto flex h-full max-w-[1280px] flex-col px-4 pt-[calc(56px+40px)] pb-6 md:px-10 lg:flex-row lg:items-center lg:gap-16 lg:pt-16 lg:pb-0'>
          <div className='relative z-[3] lg:w-1/2'>
            <h1 className='font-display text-[clamp(34px,9.4vw,44px)] leading-[1.14] font-semibold tracking-[-0.018em] md:text-[clamp(40px,3.75vw,56px)]'>
              <span className='sr-only'>{t('hero.heading-sr')}</span>
              <span aria-hidden='true' className='block lg:whitespace-nowrap'>
                {t('hero.heading')}
              </span>
              <span aria-hidden='true' className='block'>
                <RotatingWordUi words={words} />
              </span>
            </h1>
            <p className='mt-7 max-w-[440px] text-base leading-[1.6] text-muted-foreground'>{t('hero.description')}</p>
            <div className='relative mt-9 flex flex-wrap items-center gap-3 max-md:flex-col max-md:items-stretch'>
              <Link
                to={ROUTES.LOGIN}
                search={{ redirect: ROUTES.OVERVIEW }}
                className='inline-flex h-11 w-[140px] items-center justify-center rounded-full bg-primary text-[15px] font-medium text-primary-foreground shadow-primary transition-all sheen hover:brightness-110 max-md:w-full'
              >
                {t('hero.get-started')}
              </Link>
              <InstallButtonUi />
            </div>
          </div>

          <div className='relative mt-10 aspect-square w-full lg:mt-0 lg:w-1/2 lg:max-w-[min(640px,80vh)]'>
            <div className='absolute inset-0'>
              <SignetPlate scene='lattice' progress={sun} src={plateSrc} label={t('hero.plate-label')} />
            </div>
            {isWide && (
              <div
                className='absolute inset-x-6 bottom-6 z-[5] h-[62%]'
                style={{ opacity: rise, transform: `translateY(${(1 - rise) * 65}%)` }}
              >
                <TerminalCardUi reveal={rise} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroContainer;
