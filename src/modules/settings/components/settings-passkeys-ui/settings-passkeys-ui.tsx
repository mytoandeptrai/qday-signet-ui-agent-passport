import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { timeAgo } from '@/lib/format';
import type { Passkey } from '@/types/passport';

type SettingsPasskeysUiProps = {
  passkeys: Passkey[];
  canRemove: boolean;
  onAddPasskey: () => void;
  onRemovePasskey: (id: string) => void;
};

const SettingsPasskeysUi = ({ passkeys, canRemove, onAddPasskey, onRemovePasskey }: SettingsPasskeysUiProps) => {
  const { t } = useTranslation('settings-page');
  return (
    <>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-body font-medium'>{t('security.title')}</h2>
        <Button size='sm' variant='outline' onClick={onAddPasskey}>
          {t('security.add')}
        </Button>
      </div>
      <ul className='divide-y rounded-md border'>
        {passkeys.map((p) => (
          <li key={p.id} className='flex items-center justify-between px-5 py-3 text-body'>
            <div>
              <div>{p.label}</div>
              <div className='text-caption text-text-3'>{p.lastUsedAt ? t('security.used', { when: timeAgo(p.lastUsedAt) }) : t('security.never-used')}</div>
            </div>
            <button
              type='button'
              className='text-small text-muted-foreground hover:text-danger disabled:opacity-40'
              disabled={!canRemove}
              title={canRemove ? undefined : t('security.keep-one')}
              onClick={() => onRemovePasskey(p.id)}
            >
              {t('security.remove')}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SettingsPasskeysUi;
