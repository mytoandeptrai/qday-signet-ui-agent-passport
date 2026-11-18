import { CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

type InstallCommandProps = {
  prompt: string;
  windows: boolean;
  hasCode: boolean;
  canGetCode: boolean;
  isGettingCode: boolean;
  onGetCode: () => void;
  onCopy: () => void;
  onToggleWindows: () => void;
};

const InstallCommand = ({ prompt, windows, hasCode, canGetCode, isGettingCode, onGetCode, onCopy, onToggleWindows }: InstallCommandProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <>
      <div className='relative mt-3 rounded-md border bg-card p-5 pr-14'>
        <p className='font-mono text-small leading-relaxed break-words'>
          {prompt.split('`').map((part, i) => (i % 2 ? <strong key={part} className='font-bold'>{`\`${part}\``}</strong> : part))}
        </p>
        <Button
          variant='ghost'
          size='icon-sm'
          aria-label={t('details.install.copy-aria')}
          disabled={!hasCode}
          onClick={onCopy}
          className='absolute top-3 right-3 text-muted-foreground'
        >
          <CopyIcon />
        </Button>
      </div>
      <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-1'>
        {!hasCode && (
          <Button size='sm' disabled={!canGetCode || isGettingCode} onClick={onGetCode}>
            {t(isGettingCode ? 'details.install.getting-code' : 'details.install.get-code')}
          </Button>
        )}
        <Button variant='link' size='sm' onClick={onToggleWindows} className='h-auto px-0 font-normal text-muted-foreground underline'>
          {t(windows ? 'details.install.on-unix' : 'details.install.on-windows')}
        </Button>
      </div>
      <p className='mt-2 max-w-xl text-small text-muted-foreground'>{t(!hasCode && !canGetCode ? 'details.install.needs-pass' : 'details.install.without-code')}</p>
    </>
  );
};

export default InstallCommand;
