import { useGetActivityList } from '@/apis/activity';
import { VISIBLE_ACTIVITY } from '../utils';

export const useOverviewActivityContainer = () => {
  const { data: activity = [] } = useGetActivityList();
  return { items: activity.slice(0, VISIBLE_ACTIVITY) };
};
