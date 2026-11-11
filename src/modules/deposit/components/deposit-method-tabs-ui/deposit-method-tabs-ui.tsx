import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/integrations/i18n';
import { METHODS } from '../../hooks';

type DepositMethodTabsUiProps = {
  method: string;
  onMethodChange: (method: string) => void;
};

const DepositMethodTabsUi = ({ method, onMethodChange }: DepositMethodTabsUiProps) => {
  const { t } = useTranslation('deposit-page');
  return (
    <>
      <Tabs value={method} onValueChange={onMethodChange}>
        <TabsList>
          {METHODS.map((m) => (
            <TabsTrigger key={m} value={m}>
              {t(`methods.${m}.label`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className='mt-3 text-body text-muted-foreground'>{t(`methods.${method}.note`)}</p>
    </>
  );
};

export default DepositMethodTabsUi;
