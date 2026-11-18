import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { KEYS } from './keys';
import { callService, getServiceList } from './requests';
import type { GetServiceListParams } from './types';

export const useGetServiceList = (params: GetServiceListParams) =>
  useQuery({ queryKey: [KEYS.SERVICES, params], queryFn: () => getServiceList(params), placeholderData: keepPreviousData });

export const useCallServiceMutation = () => useMutation({ mutationKey: [KEYS.CALL], mutationFn: callService });
