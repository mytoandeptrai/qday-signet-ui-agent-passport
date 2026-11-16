import { CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

interface SignetpassInstallUiProps {
  prompt: string;
  windows: boolean;
  onCopy: () => void;
  onToggleWindows: () => void;
}

/** Has the `install` id so Get Started can send people straight to the command. */
const SignetpassInstallUi = ({ prompt, windows, onCopy, onToggleWindows }: SignetpassInstallUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <section id='install' className='mt-8 scroll-mt-6'>
      <h2 className='text-body font-medium'>{t('details.install.title')}</h2>
      <p className='mt-1 max-w-xl text-body text-muted-foreground'>{t('details.install.description')}</p>
      <div className='relative mt-3 rounded-md border bg-card p-5 pr-14'>
        <p className='font-mono text-small leading-relaxed'>{prompt}</p>
        <Button variant='ghost' size='icon-sm' aria-label={t('details.install.copy-aria')} onClick={onCopy} className='absolute top-3 right-3 text-muted-foreground'>
          <CopyIcon />
        </Button>
      </div>
      <Button variant='link' size='sm' onClick={onToggleWindows} className='mt-1 h-auto px-0 font-normal text-muted-foreground underline'>
        {t(windows ? 'details.install.on-unix' : 'details.install.on-windows')}
      </Button>
    </section>
  );
};

export default SignetpassInstallUi;
