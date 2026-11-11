import { type AppTableFeatures, DataTableColumnHeader } from '@/components/ui/data-table';
import { money, timeAgo } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { ActivityRow } from '../../utils';

interface ActivityColumnsProps {
  t: TFunction;
}

const sign = (row: ActivityRow) => (row.kind === 'service' ? '−' : row.kind === 'transfer' ? '+' : '');

export const createColumns = ({ t }: ActivityColumnsProps): ColumnDef<AppTableFeatures, ActivityRow>[] => [
  {
    accessorKey: 'detail',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.detail')} />,
    cell: ({ row }) => (
      <div>
        <div className='font-medium'>{row.original.detail}</div>
        <div className='text-caption text-muted-foreground'>{row.original.sub}</div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.category')} />,
    cell: ({ row }) => <span className='text-muted-foreground'>{t(`categories.${row.original.category}`)}</span>,
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.amount')} />,
    cell: ({ row }) => (
      <span
        className={cn(
          'tabular-nums',
          row.original.blocked && 'text-muted-foreground line-through',
          row.original.kind === 'transfer' && 'text-success',
          row.original.kind === 'session' && 'text-muted-foreground'
        )}
      >
        {sign(row.original)}
        {money(Math.abs(row.original.amount))}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('table.headers.time')} />,
    cell: ({ row }) => <span className='text-muted-foreground'>{timeAgo(row.original.createdAt)}</span>,
    enableSorting: false,
  },
];
