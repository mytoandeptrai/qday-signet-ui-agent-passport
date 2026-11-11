import type { ActivityRow } from './types';

/** Downloads the rows as a CSV file in the browser. */
export const downloadCsv = (rows: ActivityRow[], filename: string) => {
  const csv = [
    'id,type,detail,category,amount,status,created_at',
    ...rows.map((r) => [r.id, r.kind, `"${r.detail}"`, r.category, r.amount, r.status, r.createdAt].join(',')),
  ].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  Object.assign(document.createElement('a'), { href: url, download: filename }).click();
  URL.revokeObjectURL(url);
};
