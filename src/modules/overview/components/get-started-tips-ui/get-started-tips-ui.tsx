import { useTranslation } from '@/integrations/i18n';

const USE_CASE_KEYS = ['x402', 'ecommerce', 'prepaid'] as const;

const GetStartedTipsUi = () => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='max-w-md text-body text-muted-foreground'>
      <p>{t('learn.intro')}</p>
      <ul className='mt-3 list-disc space-y-2 pl-5'>
        {USE_CASE_KEYS.map((key) => (
          <li key={key}>{t(`learn.items.${key}`)}</li>
        ))}
      </ul>
    </div>
  );
};

export default GetStartedTipsUi;
