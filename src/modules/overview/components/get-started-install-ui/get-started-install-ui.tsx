import { useTranslation } from '@/integrations/i18n';
import { Copy } from 'lucide-react';

type GetStartedInstallUiProps = {
  prompt: string;
  windows: boolean;
  onCopy: () => void;
  onToggleWindows: () => void;
};

const GetStartedInstallUi = ({ prompt, windows, onCopy, onToggleWindows }: GetStartedInstallUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <>
      <div className='relative rounded-md border bg-background/70 p-5 pr-14'>
        <p className='font-mono text-small leading-[1.65]'>{prompt}</p>
        <button
          type='button'
          aria-label={t('install.copy-aria')}
          onClick={onCopy}
          className='absolute top-4 right-4 text-muted-foreground hover:text-foreground'
        >
          <Copy className='size-5' />
        </button>
      </div>
      <button type='button' onClick={onToggleWindows} className='mt-3 text-body text-muted-foreground underline underline-offset-4'>
        {windows ? t('install.on-unix') : t('install.on-windows')}
      </button>
    </>
  );
};

export default GetStartedInstallUi;
