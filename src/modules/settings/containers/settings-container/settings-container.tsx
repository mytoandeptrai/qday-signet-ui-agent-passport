import {
  BellIcon,
  BookOpenIcon,
  BookUserIcon,
  DropletsIcon,
  ExternalLinkIcon,
  FingerprintIcon,
  GaugeIcon,
  HistoryIcon,
  InfoIcon,
  LockIcon,
  LogOutIcon,
  MoonIcon,
  Trash2Icon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import SignStatusUi from '@/components/ui/sign-status';
import { Switch } from '@/components/ui/switch';
import { SettingsProfileUi, SettingsRowUi, SettingsSectionUi, SettingsSheetUi } from '../../components';
import { useSettingsContainer } from '../../hooks';
import { APP_VERSION, RESOURCE_LINKS } from '../../utils';
import SettingsLimitsContainer from '../settings-limits-container';
import SettingsNotificationsContainer from '../settings-notifications-container';
import SettingsSecurityContainer from '../settings-security-container';

const SettingsContainer = () => {
  const {
    t,
    user,
    connectedWallet,
    signetPass,
    passkeyEnabled,
    passkeyStatus,
    passkeySummary,
    isDark,
    autoLock,
    sheet,
    onTogglePasskey,
    onToggleAutoLock,
    onToggleDark,
    onOpenSheet,
    onCloseSheet,
    onSoon,
    onReset,
    onSignOut,
  } = useSettingsContainer();
  return (
    <div className='max-w-2xl pb-10'>
      <PageHeader title={t('title')} />
      <SettingsProfileUi user={user} connectedWallet={connectedWallet} signetPass={signetPass} />

      <SettingsSectionUi title={t('sections.wallet')}>
        <SettingsRowUi icon={BookUserIcon} label={t('rows.address-book')} detail={t('rows.address-book-detail')} onClick={() => onSoon(t('rows.address-book'))} />
      </SettingsSectionUi>

      <SettingsSectionUi title={t('sections.security')}>
        <SettingsRowUi
          icon={FingerprintIcon}
          label={t('rows.passkey')}
          detail={
            passkeyStatus === 'idle' ? (
              t(passkeyEnabled ? 'rows.passkey-on' : 'rows.passkey-off')
            ) : (
              <SignStatusUi status={passkeyStatus} summary={passkeySummary} />
            )
          }
          right={<Switch checked={passkeyEnabled} disabled={passkeyStatus === 'waiting'} onCheckedChange={onTogglePasskey} aria-label={t('rows.passkey')} />}
        />
        <SettingsRowUi
          icon={LockIcon}
          label={t('rows.auto-lock')}
          detail={t('rows.auto-lock-detail')}
          right={<Switch checked={autoLock} onCheckedChange={onToggleAutoLock} aria-label={t('rows.auto-lock')} />}
        />
        <SettingsRowUi icon={GaugeIcon} label={t('rows.limits')} detail={t('rows.limits-detail')} onClick={() => onOpenSheet('limits')} />
        <SettingsRowUi icon={HistoryIcon} label={t('rows.history')} detail={t('rows.history-detail')} onClick={() => onOpenSheet('history')} />
      </SettingsSectionUi>

      <SettingsSectionUi title={t('sections.notifications')}>
        <SettingsRowUi icon={BellIcon} label={t('rows.notifications')} detail={t('rows.notifications-detail')} onClick={() => onOpenSheet('notifications')} />
      </SettingsSectionUi>

      <SettingsSectionUi title={t('sections.appearance')}>
        <SettingsRowUi
          icon={MoonIcon}
          label={t('rows.dark-mode')}
          right={<Switch checked={isDark} onCheckedChange={onToggleDark} aria-label={t('rows.dark-mode')} />}
        />
      </SettingsSectionUi>

      <SettingsSectionUi title={t('sections.discover')}>
        <SettingsRowUi icon={DropletsIcon} label={t('rows.faucet')} detail={t('rows.faucet-detail')} onClick={() => onSoon(t('rows.faucet'))} />
        <SettingsRowUi icon={BookOpenIcon} label={t('rows.resources')} detail={t('rows.resources-detail')} onClick={() => onOpenSheet('resources')} />
      </SettingsSectionUi>

      <SettingsSectionUi title={t('sections.data')}>
        <SettingsRowUi icon={Trash2Icon} label={t('rows.reset')} detail={t('rows.reset-detail')} onClick={onReset} />
      </SettingsSectionUi>

      <SettingsSectionUi title={t('sections.about')}>
        <SettingsRowUi icon={InfoIcon} label={t('rows.version')} right={<span className='text-small text-muted-foreground'>{APP_VERSION}</span>} />
      </SettingsSectionUi>

      <Button variant='outline' className='mt-8' onClick={onSignOut}>
        <LogOutIcon />
        {t('sign-out')}
      </Button>

      <SettingsSheetUi open={sheet === 'limits'} title={t('rows.limits')} onClose={onCloseSheet}>
        <SettingsLimitsContainer />
      </SettingsSheetUi>
      <SettingsSheetUi open={sheet === 'notifications'} title={t('rows.notifications')} onClose={onCloseSheet}>
        <SettingsNotificationsContainer />
      </SettingsSheetUi>
      <SettingsSheetUi open={sheet === 'history'} title={t('rows.history')} onClose={onCloseSheet}>
        <SettingsSecurityContainer />
      </SettingsSheetUi>
      <SettingsSheetUi open={sheet === 'resources'} title={t('rows.resources')} description={t('resources.description')} onClose={onCloseSheet}>
        <div className='divide-y rounded-md border'>
          {RESOURCE_LINKS.map(({ id, href }) => (
            <a key={id} href={href} target='_blank' rel='noreferrer' className='flex items-center justify-between px-4 py-3 text-body transition-colors hover:bg-subtle'>
              {t(`resources.${id}`)}
              <ExternalLinkIcon className='size-4 text-muted-foreground' />
            </a>
          ))}
        </div>
      </SettingsSheetUi>
    </div>
  );
};

export default SettingsContainer;
