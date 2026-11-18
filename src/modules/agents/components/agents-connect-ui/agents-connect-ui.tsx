import InstallCommand from '@/components/ui/install-command';
import { useTranslation } from '@/integrations/i18n';

interface AgentsConnectUiProps {
  prompt: string;
  windows: boolean;
  hasCode: boolean;
  canGetCode: boolean;
  isGettingCode: boolean;
  onGetCode: () => void;
  onCopy: () => void;
  onToggleWindows: () => void;
}

const AgentsConnectUi = ({ prompt, ...command }: AgentsConnectUiProps) => {
  const { t } = useTranslation('agents-page');
  return (
    <section className='rounded-lg border bg-card p-5'>
      <h2 className='text-body font-medium'>{t('connect.title')}</h2>
      <p className='mt-1 text-small text-muted-foreground'>{t('connect.hint')}</p>
      <InstallCommand prompt={prompt} {...command} />
    </section>
  );
};

export default AgentsConnectUi;
