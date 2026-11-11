import { eachDayOfInterval, format } from 'date-fns';
import type { ActivityMetric, ActivityRow } from './types';

/** Sums the metric per calendar day between `from` and today (days with nothing stay at 0). */
export const buildBuckets = (rows: ActivityRow[], metric: ActivityMetric, from: Date): [string, number][] => {
  const map = new Map(eachDayOfInterval({ start: from, end: new Date() }).map((d) => [format(d, 'yyyy-MM-dd'), 0]));
  for (const r of rows) {
    const key = format(new Date(r.createdAt), 'yyyy-MM-dd');
    if (map.has(key)) map.set(key, (map.get(key) ?? 0) + metric.value(r));
  }
  return [...map];
};
