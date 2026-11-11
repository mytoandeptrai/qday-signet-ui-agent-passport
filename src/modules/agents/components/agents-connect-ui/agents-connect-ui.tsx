import CopyButton from '@/components/ui/copy-button';
import { useTranslation } from '@/integrations/i18n';

interface AgentsConnectUiProps {
  prompt: string;
}

const AgentsConnectUi = ({ prompt }: AgentsConnectUiProps) => {
  const { t } = useTranslation('agents-page');
  return (
    <section className='rounded-lg border bg-card p-5'>
      <h2 className='text-body font-medium'>{t('connect.title')}</h2>
      <p className='mt-1 text-small text-muted-foreground'>{t('connect.hint')}</p>
      <div className='mt-3 flex items-start gap-2'>
        <code className='min-w-0 flex-1 rounded-md bg-subtle p-3 font-mono text-small break-words'>{prompt}</code>
        <CopyButton value={prompt} />
      </div>
    </section>
  );
};

export default AgentsConnectUi;
