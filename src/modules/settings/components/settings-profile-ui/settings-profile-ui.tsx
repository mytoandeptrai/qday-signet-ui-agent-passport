import ShortAddress from '@/components/ui/short-address';
import { useTranslation } from '@/integrations/i18n';
import type { SignetPass, User } from '@/types/passport';

type SettingsProfileUiProps = {
  user?: User | null;
  connectedWallet?: string;
  signetPass?: SignetPass | null;
};

const SettingsProfileUi = ({ user, connectedWallet, signetPass }: SettingsProfileUiProps) => {
  const { t } = useTranslation('settings-page');
  return (
    <dl className='grid grid-cols-[max-content_1fr] items-baseline gap-x-8 gap-y-3 text-body'>
      <dt className='text-muted-foreground'>{t('account.name')}</dt>
      <dd>{user?.name}</dd>
      <dt className='text-muted-foreground'>{t('account.email')}</dt>
      <dd>{user?.email}</dd>
      <dt className='text-muted-foreground'>{t('account.connected-wallet')}</dt>
      <dd className='font-mono text-small'>{connectedWallet ? <ShortAddress value={connectedWallet} /> : t('account.not-connected')}</dd>
      <dt className='text-muted-foreground'>{t('account.wallet')}</dt>
      <dd className='font-mono text-small'>{signetPass ? <ShortAddress value={signetPass.address} /> : t('account.no-signetpass')}</dd>
    </dl>
  );
};

export default SettingsProfileUi;
