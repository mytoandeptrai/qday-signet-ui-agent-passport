import { ShieldCheckIcon } from 'lucide-react';
import { useGetSignetPasses, useSelectSignetPassMutation } from '@/apis/signetpass';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarGroup, SidebarGroupLabel, useSidebar } from '@/components/ui/sidebar';
import { NETWORKS } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

const AppSidebarSignetPass = () => {
  const { t } = useTranslation('layout');
  const { open: sidebarOpen } = useSidebar();
  const { data } = useGetSignetPasses();
  const select = useSelectSignetPassMutation();
  const passes = data?.passes ?? [];
  const selected = data?.selected;

  if (!selected) return null;

  if (!sidebarOpen) return null;

  const onValueChange = (value: string) => {
    if (value !== selected.id) select.mutate({ id: value });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className='px-3 text-small font-semibold text-foreground'>{t('nav.signetpass')}</SidebarGroupLabel>
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
        </SelectContent>
      </Select>
    </SidebarGroup>
  );
};

export default AppSidebarSignetPass;
