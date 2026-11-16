import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { CreateSignetPassFormData } from '../../hooks';

interface RenameSignetpassUiProps {
  isLoading: boolean;
}

const RenameSignetpassUi = ({ isLoading }: RenameSignetpassUiProps) => {
  const { t } = useTranslation('signetpass-page');
  const { control } = useFormContext<CreateSignetPassFormData>();
  return (
    <div className='flex flex-col gap-4'>
      <FormInput control={control} name='name' label={t('create.name')} placeholder={t('create.name-placeholder')} disabled={isLoading} required />
      <Button type='submit' disabled={isLoading}>
        {t('details.rename.submit')}
      </Button>
    </div>
  );
};

export default RenameSignetpassUi;
