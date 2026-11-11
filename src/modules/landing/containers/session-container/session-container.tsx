import { AnimationContainer } from '@/components/containers';
import { SignetPlate } from '@/components/brand/signet-plate';
import { SectionWrapUi, SessionCardUi } from '../../components';
import { useSessionContainer } from '../../hooks';

const SessionContainer = () => {
  const { t, cardRef, rows, limit, perCall, shown, spent, isRevoked, plateSrc, points, onRevoke } = useSessionContainer();

  return (
    <section id='session' className='relative z-[4] py-12 md:py-20'>
      <SectionWrapUi>
        <AnimationContainer>
          <h2 className='text-center font-display text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-semibold tracking-[-0.016em]'>
            {t('session.heading')}
          </h2>
        </AnimationContainer>
        <AnimationContainer delay={0.1}>
          <div className='relative mt-10 aspect-[.7] md:aspect-[1.75]'>
            <div className='absolute inset-0'>
              <SignetPlate scene='ledger' aspect={1.75} progress={0.75} src={plateSrc} label={t('session.plate-label')} />
            </div>
            <SessionCardUi
              cardRef={cardRef}
              rows={rows}
              limit={limit}
              perCall={perCall}
              shown={shown}
              spent={spent}
              isRevoked={isRevoked}
              onRevoke={onRevoke}
            />
          </div>
        </AnimationContainer>
        <div className='mt-10 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-10'>
          {points.map((p, i) => (
            <AnimationContainer key={p} delay={i * 0.1} className='border-t border-foreground pt-4 text-[15px] leading-[1.4]'>
              {p}
            </AnimationContainer>
          ))}
        </div>
      </SectionWrapUi>
    </section>
  );
};

export default SessionContainer;
