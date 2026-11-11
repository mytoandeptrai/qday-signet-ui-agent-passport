import { SignetPlate } from '@/components/landing/signet-plate';
import { useTranslation } from '@/integrations/i18n';

const LoginAsideUi = () => {
  const { t } = useTranslation('login-page');
  return (
    <div className='relative hidden lg:block'>
      <SignetPlate scene='orbit' label={t('aside.label')} />
    </div>
  );
};

export default LoginAsideUi;
