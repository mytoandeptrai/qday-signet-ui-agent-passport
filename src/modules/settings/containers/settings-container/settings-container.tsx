import { PageHeader } from '@/components/app/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/integrations/i18n';
import SettingsAccountContainer from '../settings-account-container';
import SettingsLimitsContainer from '../settings-limits-container';
import SettingsNotificationsContainer from '../settings-notifications-container';
import SettingsSecurityContainer from '../settings-security-container';

const SettingsContainer = () => {
  const { t } = useTranslation('settings-page');
  return (
    <div className='max-w-2xl'>
      <PageHeader title={t('title')} />
      <Tabs defaultValue='limits'>
        <TabsList>
          <TabsTrigger value='limits'>{t('tabs.limits')}</TabsTrigger>
          <TabsTrigger value='notifications'>{t('tabs.notifications')}</TabsTrigger>
          <TabsTrigger value='security'>{t('tabs.security')}</TabsTrigger>
          <TabsTrigger value='account'>{t('tabs.account')}</TabsTrigger>
        </TabsList>
        <TabsContent value='limits' className='mt-6'>
          <SettingsLimitsContainer />
        </TabsContent>
        <TabsContent value='notifications' className='mt-6'>
          <SettingsNotificationsContainer />
        </TabsContent>
        <TabsContent value='security' className='mt-6'>
          <SettingsSecurityContainer />
        </TabsContent>
        <TabsContent value='account' className='mt-6 space-y-6'>
          <SettingsAccountContainer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContainer;
