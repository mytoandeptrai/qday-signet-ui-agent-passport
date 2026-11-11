import { CheckIcon, CopyIcon } from 'lucide-react';
import { useTranslation } from '@/integrations/i18n';
import { INSTALL_COMMAND } from '@/mock/landing';
import { useCopyInstallPrompt } from '../../hooks';

const CopyCommandUi = () => {
  const { t } = useTranslation('landing-page');
  const { isCopied, onCopy } = useCopyInstallPrompt(t('install.copy-toast'), 1500);

  return (
    <button
      type='button'
      aria-label={t('install.copy-aria')}
      onClick={onCopy}
      className='flex w-full cursor-pointer items-center gap-2.5 text-left'
    >
      <span className='min-w-0 flex-1 font-mono text-[12.5px] leading-[1.45] tracking-[-0.01em]'>{INSTALL_COMMAND}</span>
      {isCopied ? <CheckIcon className='size-4 text-success' /> : <CopyIcon className='size-4 text-muted-foreground' />}
    </button>
  );
};

export default CopyCommandUi;
