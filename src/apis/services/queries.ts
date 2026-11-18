import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { KEYS } from './keys';
import { callService, getServiceList } from './requests';
import type { GetServiceListParams } from './types';

export const useGetServiceList = (params: GetServiceListParams) =>
  useQuery({ queryKey: [KEYS.SERVICES, params], queryFn: () => getServiceList(params), placeholderData: keepPreviousData });

// A call does not change the store, so nothing is refreshed.
export const useCallServiceMutation = () => useMutation({ mutationKey: [KEYS.CALL], mutationFn: callService });
