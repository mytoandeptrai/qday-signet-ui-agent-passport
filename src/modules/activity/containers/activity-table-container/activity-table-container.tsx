import { DataTable } from '@/components/ui/data-table';
import { useTranslation } from '@/integrations/i18n';
import { useMemo } from 'react';
import type { ActivityRow } from '../../utils';
import { createColumns } from './create-columns';

type ActivityTableContainerProps = {
  rows: ActivityRow[];
  pagination: { pageIndex: number; pageSize: number; pageCount: number; hasNext: boolean; hasPrev: boolean };
  onPaginationChange: (page: number, pageSize: number, action: 'pagination' | 'limiting') => void;
  onRowClick: (row: ActivityRow) => void;
};

const ActivityTableContainer = ({ rows, pagination, onPaginationChange, onRowClick }: ActivityTableContainerProps) => {
  const { t } = useTranslation('activity-page');
  const columns = useMemo(() => createColumns({ t }), [t]);
  return (
    <div className='mt-8'>
      <DataTable
        columns={columns}
        data={rows}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        onRowClick={(_, row) => onRowClick(row)}
      />
    </div>
  );
};

export default ActivityTableContainer;
