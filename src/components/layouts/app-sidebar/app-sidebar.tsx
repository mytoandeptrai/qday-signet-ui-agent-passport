import { Link, useMatchRoute } from '@tanstack/react-router';
import { ChevronDownIcon, CircleHelpIcon, PlusIcon /* , WaypointsIcon */ } from 'lucide-react';
import { SignetLockup, SignetMark } from '@/components/brand/signet-mark';
import { CustomLink } from '@/components/ui/custom-link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  // SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import AppSidebarSignetPass from './app-sidebar-signetpass';
import AppSidebarWallet from './app-sidebar-wallet';
import { useAppSidebar } from './use-app-sidebar';

const menuButtonClass = 'h-10 gap-3 px-3 text-body [&_svg]:size-4.5 [&_svg]:text-muted-foreground';

const AppSidebar = () => {
  const { t } = useTranslation('layout');
  const matchRoute = useMatchRoute();
  const { items, /* onRouterClick, */ onDocsClick, onSupportClick } = useAppSidebar();

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='px-4 pt-5 pb-6 group-data-[collapsible=icon]:px-0'>
        <CustomLink to={ROUTES.HOME} aria-label='Signet' className='flex items-center p-0 group-data-[collapsible=icon]:justify-center'>
          <SignetMark className='hidden size-7 shrink-0 group-data-[collapsible=icon]:block' />
          <span className='group-data-[collapsible=icon]:hidden'>
            <SignetLockup linked={false} className='h-7' />
          </span>
        </CustomLink>
        <div className='mt-5 group-data-[collapsible=icon]:mt-4'>
          <AppSidebarSignetPass />
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden px-2 group-data-[collapsible=icon]:px-0'>
        <SidebarGroup>
          <SidebarMenu>
            {items.map(({ url, title, icon: Icon }) => (
              <SidebarMenuItem key={url}>
                <SidebarMenuButton
                  asChild
                  tooltip={title}
                  isActive={!!matchRoute({ to: url, fuzzy: true })}
                  className={menuButtonClass}
                >
                  <Link to={url}>
                    <Icon strokeWidth={1.4} />
                    <span>{title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* Signet Router is not available yet; restore this group (and onRouterClick) when it ships.
        <SidebarGroup className='mt-4'>
          <SidebarGroupLabel className='px-3 text-small font-medium text-muted-foreground'>
            {t('nav.products')}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={t('nav.signet-router')} onClick={onRouterClick} className={menuButtonClass}>
                <WaypointsIcon strokeWidth={1.4} />
                <span>{t('nav.signet-router')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        */}
      </SidebarContent>
      <SidebarFooter className='px-2 pb-3'>
        <SidebarMenu>
          <AppSidebarWallet />
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t('nav.new-session')} className={`${menuButtonClass} text-muted-foreground`}>
              <Link to={ROUTES.OVERVIEW} search={{ dialog: 'create-session' }}>
                <PlusIcon strokeWidth={1.4} />
                <span>{t('nav.new-session')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip={t('nav.help')} className={`${menuButtonClass} text-muted-foreground`}>
                  <CircleHelpIcon strokeWidth={1.4} />
                  <span>{t('nav.help')}</span>
                  <ChevronDownIcon className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side='top' align='start' className='w-48'>
                <DropdownMenuItem onSelect={onDocsClick}>{t('help.documentation')}</DropdownMenuItem>
                <DropdownMenuItem onSelect={onSupportClick}>{t('help.contact-support')}</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={ROUTES.TERMS}>{t('help.terms')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={ROUTES.PRIVACY}>{t('help.privacy')}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
