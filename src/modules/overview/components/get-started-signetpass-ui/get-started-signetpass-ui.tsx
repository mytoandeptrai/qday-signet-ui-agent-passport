import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

type GetStartedSignetpassUiProps = {
  created: boolean;
  onCreate: () => void;
};

const GetStartedSignetpassUi = ({ created, onCreate }: GetStartedSignetpassUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='max-w-md text-body text-muted-foreground'>
      <p>{created ? t('signetpass.created') : t('signetpass.none')}</p>
      {!created && (
        <Button className='mt-4' variant='outline' onClick={onCreate}>
          {t('signetpass.create')}
        </Button>
      )}
    </div>
  );
};

export default GetStartedSignetpassUi;
