import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building, Database, KeySquare, LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: route('dashboard'),
    icon: LayoutGrid,
  },
  {
    title: 'Divisi',
    href: route('divisi.index'),
    icon: Building,
  },
  {
    title: 'Karyawan',
    href: route('user.index'),
    icon: Building,
  },
  {
    title: 'Documentation',
    href: route('documentation'),
    icon: Users,
  },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
  const { menus } = usePage<{ menus: Record<string, boolean> }>().props;

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="space-y-4">
        <NavMain items={mainNavItems} label="Dashboard" />
        <NavMain
          items={[
            {
              title: 'Role & permission',
              href: route('role.index'),
              icon: KeySquare,
              available: menus.role,
            },
            {
              title: 'Adminer database',
              href: '/adminer',
              icon: Database,
              available: menus.adminer,
            },
          ]}
          label="Settings"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
