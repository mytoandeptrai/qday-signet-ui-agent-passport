import InstallCommand from '@/components/ui/install-command';
import { useTranslation } from '@/integrations/i18n';

interface SignetpassInstallUiProps {
  prompt: string;
  windows: boolean;
  hasCode: boolean;
  canGetCode: boolean;
  isGettingCode: boolean;
  onGetCode: () => void;
  onCopy: () => void;
  onToggleWindows: () => void;
}

/** Has the `install` id so Get Started can send people straight to the command. */
const SignetpassInstallUi = (props: SignetpassInstallUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <section id='install' className='mt-8 scroll-mt-6'>
      <h2 className='text-body font-medium'>{t('details.install.title')}</h2>
      <p className='mt-1 max-w-xl text-body text-muted-foreground'>{t('details.install.description')}</p>
      <InstallCommand {...props} />
    </section>
  );
};

export default SignetpassInstallUi;
