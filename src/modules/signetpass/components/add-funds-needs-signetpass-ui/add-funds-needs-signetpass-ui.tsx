import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

interface AddFundsNeedsSignetPassUiProps {
  onCreate: () => void;
}

const AddFundsNeedsSignetPassUi = ({ onCreate }: AddFundsNeedsSignetPassUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <div className='flex flex-col items-start gap-3'>
      <p className='text-body text-muted-foreground'>{t('add-funds.needs-signetpass')}</p>
      <Button onClick={onCreate}>{t('add-funds.create-first')}</Button>
    </div>
  );
};

export default AddFundsNeedsSignetPassUi;
