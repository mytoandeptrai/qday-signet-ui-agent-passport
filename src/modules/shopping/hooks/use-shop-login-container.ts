import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLoginEcommerceMutation } from '@/apis/shopping';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { getShopMerchant } from '../utils';
import { type EcommerceLoginFormData, ecommerceLoginSchema, initialEcommerceLoginFormData } from './schema';

export const useShopLoginContainer = () => {
  const { t } = useTranslation('shopping-page');
  const { params, close } = useAppDialog();
  const login = useLoginEcommerceMutation();
  const merchantId = params.id ?? '';
  const form = useForm<EcommerceLoginFormData>({
    resolver: zodResolver(ecommerceLoginSchema(t)),
    defaultValues: initialEcommerceLoginFormData,
    mode: 'onChange',
  });

  return {
    form,
    merchantName: getShopMerchant(merchantId)?.name ?? merchantId,
    isLoading: login.isPending,
    onSubmit: async (values: EcommerceLoginFormData) => {
      await login.mutateAsync({ merchantId, ...values });
      close();
    },
  };
};
