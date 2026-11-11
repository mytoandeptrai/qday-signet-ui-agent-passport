import WalletGate from '@/components/ui/wallet-gate';
import { Modal } from '@/components/ui/modal';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { APP_DIALOG_CONFIG } from './app-dialogs.config';

/** Renders whichever dialog or sheet the `dialog` search param names. Every one handles money or signing, so each is wallet-gated. */
const AppDialogs = () => {
  const { t } = useTranslation('layout');
  const { dialog, close } = useAppDialog();
  const config = dialog ? APP_DIALOG_CONFIG[dialog] : undefined;
  if (!dialog || !config) return null;

  const { kind, Content } = config;
  const title = t(`dialogs.${dialog}.title`);
  const description = t(`dialogs.${dialog}.description`);

  if (kind === 'sheet')
    return (
      <Sheet open onOpenChange={(open) => !open && close()}>
        <SheetContent className='sm:max-w-md'>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className='px-4 pb-4'>
            <WalletGate>
              <Content />
            </WalletGate>
          </div>
        </SheetContent>
      </Sheet>
    );

  return (
    <Modal isOpen title={title} description={description} onClose={close}>
      <WalletGate>
        <Content />
      </WalletGate>
    </Modal>
  );
};

export default AppDialogs;
