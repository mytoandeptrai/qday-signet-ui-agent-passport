import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { KEYS } from './keys';
import { getServiceList } from './requests';
import type { GetServiceListParams } from './types';

export const useGetServiceList = (params: GetServiceListParams) =>
  useQuery({ queryKey: [KEYS.SERVICES, params], queryFn: () => getServiceList(params), placeholderData: keepPreviousData });
