import { useGetActivityList } from '@/apis/activity';
import { useGetSessionList } from '@/apis/sessions';
import type { ActivityRow } from '../utils';

export const useActivityDetailContainer = (row: ActivityRow | null) => {
  const { data: activity = [] } = useGetActivityList();
  const { data: sessions = [] } = useGetSessionList();
  const item = row?.kind === 'service' ? activity.find((x) => x.id === row.id) : undefined;
  return {
    reason: item?.reason,
    task: sessions.find((s) => s.id === item?.sessionId)?.task,
  };
};
