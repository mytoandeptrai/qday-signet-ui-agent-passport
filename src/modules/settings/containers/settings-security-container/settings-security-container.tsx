import { SettingsSecurityHistoryUi } from '../../components';
import { useSettingsSecurityContainer } from '../../hooks';

const SettingsSecurityContainer = () => {
  const { events } = useSettingsSecurityContainer();
  return <SettingsSecurityHistoryUi events={events} />;
};

export default SettingsSecurityContainer;
