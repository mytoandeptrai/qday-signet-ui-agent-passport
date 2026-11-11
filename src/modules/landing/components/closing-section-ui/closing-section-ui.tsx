import { Link } from '@tanstack/react-router';
import { AnimationContainer } from '@/components/containers';
import { SignetPlate } from '@/components/brand/signet-plate';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { PLATE_IMAGES } from '@/mock/landing';
import SectionWrapUi from '../section-wrap-ui';

const ClosingSectionUi = () => {
  const { t } = useTranslation('landing-page');

  return (
    <section className='relative z-4 pt-16 pb-12 text-center md:pt-24 md:pb-20'>
      <SectionWrapUi>
        <AnimationContainer>
          <h2 className='mb-9 font-display text-[clamp(34px,3.1vw,46px)] leading-tight font-semibold tracking-tight'>
            {t('closing.heading')}
          </h2>
          <Link
            to={ROUTES.LOGIN}
            search={{ redirect: ROUTES.OVERVIEW }}
            className='inline-flex h-11 w-35 items-center justify-center rounded-full bg-primary text-lead font-medium text-primary-foreground shadow-primary transition-all sheen hover:brightness-110'
          >
            {t('hero.get-started')}
          </Link>
        </AnimationContainer>
        <AnimationContainer delay={0.1} className='relative mt-14 aspect-[1.6] md:aspect-[3.4]'>
          <SignetPlate scene='orbit' aspect={3.4} src={PLATE_IMAGES.close || undefined} label={t('closing.plate-label')} />
        </AnimationContainer>
      </SectionWrapUi>
    </section>
  );
};

export default ClosingSectionUi;
