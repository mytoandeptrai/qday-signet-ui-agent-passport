import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import {
  completeOnboarding,
  getBalance,
  getOnboarding,
  getProfile,
  getSettings,
  resetDemoData,
  updateSettings,
} from './requests';

export const useGetProfile = () => useQuery({ queryKey: [KEYS.PROFILE], queryFn: getProfile });
export const useGetBalance = () => useQuery({ queryKey: [KEYS.BALANCE], queryFn: getBalance });
export const useGetSettings = () => useQuery({ queryKey: [KEYS.SETTINGS], queryFn: getSettings });
export const useGetOnboarding = () => useQuery({ queryKey: [KEYS.ONBOARDING], queryFn: getOnboarding });

// The demo store is one database, so a write can change any screen: refresh everything.
const useRefreshAll = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries();
};

export const useUpdateSettingsMutation = () => {
  const refresh = useRefreshAll();
  return useMutation({ mutationKey: [KEYS.SETTINGS], mutationFn: updateSettings, onSuccess: refresh });
};

export const useCompleteOnboardingMutation = () => {
  const refresh = useRefreshAll();
  return useMutation({ mutationKey: [KEYS.ONBOARDING], mutationFn: completeOnboarding, onSuccess: refresh });
};

export const useResetDemoDataMutation = () => {
  const refresh = useRefreshAll();
  return useMutation({ mutationKey: [KEYS.RESET], mutationFn: resetDemoData, onSuccess: refresh });
};
