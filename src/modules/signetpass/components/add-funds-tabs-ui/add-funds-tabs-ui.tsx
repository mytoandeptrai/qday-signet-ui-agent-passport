import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/integrations/i18n';
import { ADD_FUNDS_TABS } from '../../hooks';

interface AddFundsTabsUiProps {
  tab: string;
  onTabChange: (tab: string) => void;
  cardEnabled: boolean;
}

const AddFundsTabsUi = ({ tab, onTabChange, cardEnabled }: AddFundsTabsUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <Tabs value={tab} onValueChange={onTabChange}>
      <TabsList>
        {ADD_FUNDS_TABS.map((id) => (
          <TabsTrigger key={id} value={id} disabled={id === 'card' && !cardEnabled}>
            {t(`add-funds.tabs.${id}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default AddFundsTabsUi;
