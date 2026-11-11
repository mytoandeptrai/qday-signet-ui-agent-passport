import { useTranslation } from '@/integrations/i18n';

const TIP_KEYS = ['session', 'stopped', 'revoke'] as const;

const GetStartedTipsUi = () => {
  const { t } = useTranslation('overview-page');
  return (
    <ul className='max-w-md list-disc space-y-2 pl-5 text-body text-muted-foreground'>
      {TIP_KEYS.map((key) => (
        <li key={key}>{t(`tips.${key}`)}</li>
      ))}
    </ul>
  );
};

export default GetStartedTipsUi;
