import { lazy, Suspense } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '../i18n';
import { useMoonPayBuyStore } from './moonpay-store';

const MoonPayBuyWidget = lazy(() => import('./moonpay-buy-widget'));

/** Mounted once in the app layout; shows the MoonPay overlay whenever a purchase is started. */
const MoonPayHost = () => {
  const { t } = useTranslation('signetpass-page');
  const { status, walletAddress, ready, stop } = useMoonPayBuyStore();

  if (status === 'idle' || !walletAddress) return null;

  return (
    <Suspense fallback={null}>
      <MoonPayBuyWidget
        walletAddress={walletAddress}
        onReady={ready}
        onClose={stop}
        onSubmitted={() => toast.success(t('add-funds.card.toasts.submitted'))}
        onCompleted={() => toast.success(t('add-funds.card.toasts.completed'))}
        onError={() => {
          stop();
          toast.error(t('add-funds.card.toasts.error'));
        }}
      />
    </Suspense>
  );
};

export default MoonPayHost;
