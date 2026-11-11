import { Link } from '@tanstack/react-router';
import { ROUTES } from '@/constant';
import { FeaturedServicesUi, PartnersUi } from '../../components';
import { useEcosystemContainer } from '../../hooks';

const EcosystemContainer = () => {
  const { t, featured, partners } = useEcosystemContainer();
  return (
    <div className='mx-auto w-full max-w-[1100px]'>
      <h1 className='font-display text-[clamp(34px,3.1vw,46px)] leading-[1.15] font-semibold tracking-[-0.016em]'>{t('title')}</h1>
      <p className='mt-3 max-w-xl text-muted-foreground'>{t('description')}</p>
      <h2 className='mt-12 mb-4 text-sm font-medium'>{t('featured')}</h2>
      <FeaturedServicesUi services={featured} />
      <Link to={ROUTES.EXPLORE} className='mt-6 inline-block text-[15px] hover:text-muted-foreground'>
        {t('browse-all')}
      </Link>
      <h2 className='mt-14 mb-4 text-sm font-medium'>{t('partners')}</h2>
      <PartnersUi partners={partners} />
    </div>
  );
};

export default EcosystemContainer;
