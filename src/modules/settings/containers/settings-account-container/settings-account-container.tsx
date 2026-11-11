import { SettingsAccountUi } from '../../components';
import { useSettingsAccountContainer } from '../../hooks';

const SettingsAccountContainer = () => {
  const { user, appearance, onChangeAppearance, onReset } = useSettingsAccountContainer();
  return <SettingsAccountUi user={user} appearance={appearance} onChangeAppearance={onChangeAppearance} onReset={onReset} />;
};

export default SettingsAccountContainer;
