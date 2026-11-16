import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

type GetStartedSignetpassUiProps = {
  created: boolean;
  needsActivation: boolean;
  onCreate: () => void;
  onActivate: () => void;
};

const GetStartedSignetpassUi = ({ created, needsActivation, onCreate, onActivate }: GetStartedSignetpassUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='max-w-3xl text-body text-muted-foreground'>
      <p>{!created ? t('signetpass.none') : needsActivation ? t('signetpass.inactive') : t('signetpass.created')}</p>
      {!created && (
        <Button className='mt-4' variant='outline' onClick={onCreate}>
          {t('signetpass.create')}
        </Button>
      )}
      {needsActivation && (
        <Button className='mt-4' variant='outline' onClick={onActivate}>
          {t('signetpass.activate')}
        </Button>
      )}
    </div>
  );
};

export default GetStartedSignetpassUi;
