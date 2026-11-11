import { useGetSecurityLog } from '@/apis/agents';

export const useSettingsSecurityContainer = () => {
  const { data: events = [] } = useGetSecurityLog();
  return { events };
};
