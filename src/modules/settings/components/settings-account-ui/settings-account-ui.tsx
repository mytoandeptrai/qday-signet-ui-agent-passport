import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/integrations/i18n';
import { shortAddress } from '@/lib/format';
import type { Appearance, User } from '@/types/passport';
import { APPEARANCES } from '../../hooks';

type SettingsAccountUiProps = {
  user?: User | null;
  appearance?: Appearance;
  onChangeAppearance: (appearance: Appearance) => void;
  onReset: () => void;
};

const SettingsAccountUi = ({ user, appearance, onChangeAppearance, onReset }: SettingsAccountUiProps) => {
  const { t } = useTranslation('settings-page');
  return (
    <>
      <dl className='grid grid-cols-[120px_1fr] gap-y-3 text-body'>
        <dt className='text-muted-foreground'>{t('account.name')}</dt>
        <dd>{user?.name}</dd>
        <dt className='text-muted-foreground'>{t('account.email')}</dt>
        <dd>{user?.email}</dd>
        <dt className='text-muted-foreground'>{t('account.wallet')}</dt>
        <dd className='font-mono text-small'>{user && shortAddress(user.walletAddress)}</dd>
      </dl>
      <div>
        <Label className='mb-2'>{t('account.appearance')}</Label>
        <div className='flex gap-2'>
          {APPEARANCES.map((a) => (
            <Button key={a} type='button' size='sm' variant={appearance === a ? 'default' : 'outline'} onClick={() => onChangeAppearance(a)}>
              {t(`account.appearances.${a}`)}
            </Button>
          ))}
        </div>
      </div>
      <div className='border-t pt-6'>
        <p className='mb-3 text-body text-muted-foreground'>{t('account.reset-description')}</p>
        <Button variant='outline' onClick={onReset}>
          {t('account.reset')}
        </Button>
      </div>
    </>
  );
};

export default SettingsAccountUi;
