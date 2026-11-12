import { MoonPayBuyWidget as SdkBuyWidget, MoonPayProvider } from '@moonpay/moonpay-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../theme/theme-context';
import { useSystemColorScheme } from '../theme/use-system-color-scheme';
import { moonPayConfig } from './config';
import { requestIpHash, requestSignature } from './sign-url';

export type MoonPayBuyWidgetProps = {
  walletAddress: string;
  onReady: () => void;
  onClose: () => void;
  onSubmitted: () => void;
  onCompleted: () => void;
  onError: () => void;
};

// Loaded lazily: the MoonPay SDK is only fetched once the user asks to buy.
const MoonPayBuyWidget = ({ walletAddress, onReady, onClose, onSubmitted, onCompleted, onError }: MoonPayBuyWidgetProps) => {
  const { theme } = useTheme();
  const systemColorScheme = useSystemColorScheme();
  const { i18n } = useTranslation();
  const [ipHash, setIpHash] = useState<string>();
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // The IP hash has to be in the URL before it is signed, so the widget waits for it.
  useEffect(() => {
    let cancelled = false;
    requestIpHash()
      .then((hash) => !cancelled && setIpHash(hash))
      .catch(() => !cancelled && onErrorRef.current());
    return () => {
      cancelled = true;
    };
  }, []);

  const signUrl = async (url: string) => {
    try {
      return await requestSignature(url);
    } catch (error) {
      onError();
      throw error;
    }
  };

  if (!ipHash) return null;

  return (
    <MoonPayProvider apiKey={moonPayConfig.apiKey}>
      <SdkBuyWidget
        variant='overlay'
        visible
        baseCurrencyCode='usd'
        defaultCurrencyCode={moonPayConfig.currencyCode}
        walletAddress={walletAddress}
        allowedIpAddress={ipHash}
        theme={theme === 'system' ? systemColorScheme : theme}
        language={i18n.resolvedLanguage}
        onUrlSignatureRequested={signUrl}
        onReady={async () => onReady()}
        onClose={async () => onClose()}
        onTransactionCreated={async () => onSubmitted()}
        onTransactionCompleted={async () => onCompleted()}
      />
    </MoonPayProvider>
  );
};

export default MoonPayBuyWidget;
