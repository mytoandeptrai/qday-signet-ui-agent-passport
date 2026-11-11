import { SettingsAccountUi } from '../../components';
import { useSettingsAccountContainer } from '../../hooks';

const SettingsAccountContainer = () => {
  const { user, connectedWallet, appearance, onChangeAppearance, onReset } = useSettingsAccountContainer();
  return <SettingsAccountUi user={user} connectedWallet={connectedWallet} appearance={appearance} onChangeAppearance={onChangeAppearance} onReset={onReset} />;
};

export default SettingsAccountContainer;
