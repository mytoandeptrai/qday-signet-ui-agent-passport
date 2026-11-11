import { useQuery } from '@tanstack/react-query';
import { KEYS } from './keys';
import { getActivityList } from './requests';

export const useGetActivityList = () => useQuery({ queryKey: [KEYS.ACTIVITY], queryFn: getActivityList });
