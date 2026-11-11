import { useGetDepositList } from '@/apis/deposits';

export const useDepositHistoryContainer = () => {
  const { data: deposits = [] } = useGetDepositList();
  return { deposits };
};
