import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

interface CreateSessionNeedsActivationUiProps {
  onActivate: () => void;
}

/** A SignetPass that is not activated yet can't hold funds, so it can't back a session. */
const CreateSessionNeedsActivationUi = ({ onActivate }: CreateSessionNeedsActivationUiProps) => {
  const { t } = useTranslation('create-session-page');
  return (
    <div className='flex flex-col items-start gap-3'>
      <p className='text-body text-muted-foreground'>{t('needs-activation.text')}</p>
      <Button onClick={onActivate}>{t('needs-activation.action')}</Button>
    </div>
  );
};

export default CreateSessionNeedsActivationUi;
