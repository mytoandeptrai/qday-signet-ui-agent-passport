import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { INSTALL_COMMAND } from '@/mock/landing';
import { useCopyInstallPrompt } from '../../hooks';

const InstallButtonUi = () => {
  const { t } = useTranslation('landing-page');
  const { isCopied, onCopy } = useCopyInstallPrompt(t('install.toast'), 2000);

  return (
    <div className='group/inst relative flex w-35 max-md:w-full'>
      <button
        type='button'
        onClick={onCopy}
        aria-label={t('install.aria')}
        className={cn(
          'inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-input bg-card px-4 text-lead font-medium whitespace-nowrap transition-[width,background-color] duration-300 hover:bg-subtle',
          isCopied ? 'w-62.5 text-body max-md:w-full' : 'w-35 max-md:w-full'
        )}
      >
        <span aria-live='polite'>{isCopied ? t('install.copied') : t('install.button')}</span>
      </button>
      <div
        role='note'
        className={cn(
          'pointer-events-none invisible absolute top-[calc(100%+10px)] left-1/2 z-10 w-110 max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1 cursor-pointer rounded-md border bg-popover px-4 pt-3.5 pb-3 text-left opacity-0 shadow-dialog transition-all duration-200 group-focus-within/inst:visible group-focus-within/inst:translate-y-0 group-focus-within/inst:opacity-100 group-hover/inst:pointer-events-auto group-hover/inst:visible group-hover/inst:translate-y-0 group-hover/inst:opacity-100 max-md:left-0 max-md:w-auto max-md:translate-x-0',
          isCopied && '!invisible !opacity-0'
        )}
        onClick={onCopy}
      >
        <p className='text-body leading-normal'>
          {t('install.tip-before')}{' '}
          <code className='rounded-sm bg-subtle px-1 font-mono text-small break-all'>{INSTALL_COMMAND}</code>
          {t('install.tip-after')}
        </p>
        <p className='mt-2.5 flex justify-between gap-3 border-t pt-2 text-xs text-text-3'>
          <span>{t('install.tip-hint')}</span>
          <b className='font-medium text-muted-foreground'>{t('install.tip-action')}</b>
        </p>
      </div>
    </div>
  );
};

export default InstallButtonUi;
