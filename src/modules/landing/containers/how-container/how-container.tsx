import { AnimationContainer } from '@/components/containers';
import { CopyCommandUi, HowStepUi, JobPromptUi, LimitMeterUi, SectionWrapUi } from '../../components';
import { useHowContainer } from '../../hooks';

const HowContainer = () => {
  const { t, isAsked, steps, onAsk } = useHowContainer();
  const overlays = [<CopyCommandUi key='install' />, <LimitMeterUi key='limits' />, <JobPromptUi key='job' isAsked={isAsked} onAsk={onAsk} />];

  return (
    <section id='how' className='relative z-4 py-12 md:py-20'>
      <SectionWrapUi>
        <AnimationContainer>
          <p className='mb-4.5 text-body text-text-3'>{t('how.eyebrow')}</p>
          <h2 className='font-display text-[clamp(34px,3.1vw,46px)] leading-tight font-semibold tracking-tight'>{t('how.heading')}</h2>
        </AnimationContainer>
        <div className='mt-10 grid gap-14 md:mt-16 md:grid-cols-3 md:gap-10'>
          {steps.map((s, i) => (
            <AnimationContainer key={s.n} delay={i * 0.12}>
              <HowStepUi n={s.n} title={s.title} scene={s.scene} level={s.level} plateSrc={s.plateSrc}>
                {overlays[i]}
              </HowStepUi>
            </AnimationContainer>
          ))}
        </div>
      </SectionWrapUi>
    </section>
  );
};

export default HowContainer;
