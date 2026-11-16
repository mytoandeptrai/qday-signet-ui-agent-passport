import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/integrations/i18n';
import { FUND_SIGNETPASS_TABS } from '../../hooks';

interface FundSignetpassTabsUiProps {
  tab: string;
  onTabChange: (tab: string) => void;
}

const FundSignetpassTabsUi = ({ tab, onTabChange }: FundSignetpassTabsUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <Tabs value={tab} onValueChange={onTabChange}>
      <TabsList>
        {FUND_SIGNETPASS_TABS.map((id) => (
          <TabsTrigger key={id} value={id}>
            {t(`fund.tabs.${id}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default FundSignetpassTabsUi;
