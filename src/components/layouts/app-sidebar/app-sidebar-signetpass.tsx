import { PlusIcon, ShieldCheckIcon } from 'lucide-react';
import { useGetSignetPasses, useSelectSignetPassMutation } from '@/apis/signetpass';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';

const CREATE_VALUE = '__create__';

/** Picks the SignetPass every app screen shows: its balance, sessions, agents and activity. */
const AppSidebarSignetPass = () => {
  const { t } = useTranslation('layout');
  const { open: sidebarOpen } = useSidebar();
  const { open } = useAppDialog();
  const { data } = useGetSignetPasses();
  const select = useSelectSignetPassMutation();
  const passes = data?.passes ?? [];
  const selected = data?.selected;
  const onCreate = () => open('create-signetpass');

  if (!selected) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={t('signetpass.create')}
            onClick={onCreate}
            className='h-10 gap-3 border border-border px-3 text-body hover:border-primary/40 hover:bg-primary/5 [&_svg]:size-4.5'
          >
            <PlusIcon strokeWidth={1.4} />
            <span>{t('signetpass.create')}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // The collapsed icon rail has no room for a select.
  if (!sidebarOpen) return null;

  const onValueChange = (value: string) => {
    if (value === CREATE_VALUE) return onCreate();
    if (value !== selected.id) select.mutate({ id: value });
  };

  return (
    <Select value={selected.id} onValueChange={onValueChange}>
      <SelectTrigger className='w-full cursor-pointer' aria-label={t('signetpass.label', { count: passes.length })}>
        <ShieldCheckIcon />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {passes.map((pass) => (
          <SelectItem key={pass.id} value={pass.id} className='cursor-pointer'>
            <span className='truncate'>{pass.name}</span>
            <span className='mt-0.5 font-mono text-small font-semibold opacity-70'>{NETWORKS[pass.network].token.symbol}</span>
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem value={CREATE_VALUE} className='cursor-pointer'>
          <PlusIcon />
          {t('signetpass.create')}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default AppSidebarSignetPass;
