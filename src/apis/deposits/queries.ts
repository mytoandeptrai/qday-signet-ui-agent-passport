import { useQuery } from '@tanstack/react-query';
import { KEYS } from './keys';
import { getDepositList } from './requests';

export const useGetDepositList = () => useQuery({ queryKey: [KEYS.DEPOSITS], queryFn: getDepositList });
