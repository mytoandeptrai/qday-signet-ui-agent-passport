import { StoreIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { EcommerceLoginFormData } from '../../hooks';

interface ShopLoginUiProps {
  isLoading: boolean;
}

/** Shopping starts with the shopper's e-commerce account, which tells us their name and shipping address. */
const ShopLoginUi = ({ isLoading }: ShopLoginUiProps) => {
  const { t } = useTranslation('shopping-page');
  const { control } = useFormContext<EcommerceLoginFormData>();
  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <div className='flex w-full max-w-sm flex-col gap-4 rounded-lg border bg-card p-6'>
        <div className='flex flex-col items-center gap-2 text-center'>
          <StoreIcon className='size-10 text-muted-foreground' strokeWidth={1.2} aria-hidden='true' />
          <h2 className='text-lead font-medium'>{t('login.title')}</h2>
          <p className='text-body text-muted-foreground'>{t('login.description')}</p>
        </div>
        <FormInput control={control} name='email' type='email' label={t('login.email')} disabled={isLoading} />
        <FormInput control={control} name='password' type='password' label={t('login.password')} disabled={isLoading} />
        <Button type='submit' disabled={isLoading}>
          {t(isLoading ? 'login.logging-in' : 'login.submit')}
        </Button>
      </div>
    </div>
  );
};

export default ShopLoginUi;
