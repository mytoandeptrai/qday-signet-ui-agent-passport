import { CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

type GetStartedInstallUiProps = {
  text: string;
  prompt: string;
  windows: boolean;
  onCopy: () => void;
  onToggleWindows: () => void;
};

/** The same command as on SignetPass details, so the CLI steps need no trip to that page. */
const GetStartedInstallUi = ({ text, prompt, windows, onCopy, onToggleWindows }: GetStartedInstallUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <div className='max-w-3xl text-body text-muted-foreground'>
      <p>{text}</p>
      <div className='relative mt-4 rounded-md border bg-card p-5 pr-14'>
        <p className='font-mono text-small leading-relaxed text-foreground'>{prompt}</p>
        <Button variant='ghost' size='icon-sm' aria-label={t('details.install.copy-aria')} onClick={onCopy} className='absolute top-3 right-3 text-muted-foreground'>
          <CopyIcon />
        </Button>
      </div>
      <Button variant='link' size='sm' onClick={onToggleWindows} className='mt-1 h-auto px-0 font-normal text-muted-foreground underline'>
        {t(windows ? 'details.install.on-unix' : 'details.install.on-windows')}
      </Button>
    </div>
  );
};

export default GetStartedInstallUi;
