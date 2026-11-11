import { SettingsPasskeysUi } from '../../components';
import { useSettingsSecurityContainer } from '../../hooks';

const SettingsSecurityContainer = () => {
  const { passkeys, canRemove, onAddPasskey, onRemovePasskey } = useSettingsSecurityContainer();
  return <SettingsPasskeysUi passkeys={passkeys} canRemove={canRemove} onAddPasskey={onAddPasskey} onRemovePasskey={onRemovePasskey} />;
};

export default SettingsSecurityContainer;
