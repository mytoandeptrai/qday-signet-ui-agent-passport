import { StoreIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { ECOMMERCE_SIGNUP_URL } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import type { EcommerceLoginFormData } from '../../hooks';

interface ShopLoginUiProps {
  merchantName: string;
  isLoading: boolean;
}

const ShopLoginUi = ({ merchantName, isLoading }: ShopLoginUiProps) => {
  const { t } = useTranslation('shopping-page');
  const { control } = useFormContext<EcommerceLoginFormData>();
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <StoreIcon className='size-10 text-muted-foreground' strokeWidth={1.2} aria-hidden='true' />
        <p className='text-body text-muted-foreground'>{t('login.merchant', { merchant: merchantName })}</p>
      </div>
      <FormInput control={control} name='email' type='email' label={t('login.email')} disabled={isLoading} />
      <FormInput control={control} name='password' type='password' label={t('login.password')} disabled={isLoading} />
      <Button type='submit' disabled={isLoading}>
        {t(isLoading ? 'login.logging-in' : 'login.submit')}
      </Button>
      <p className='text-center text-small text-muted-foreground'>
        {t('login.no-account')}{' '}
        <a href={ECOMMERCE_SIGNUP_URL} target='_blank' rel='noreferrer' className='font-medium text-foreground underline'>
          {t('login.sign-up')}
        </a>
      </p>
    </div>
  );
};

export default ShopLoginUi;
