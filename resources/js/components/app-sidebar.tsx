import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookCheck, BookMarked, Building, Database, KeySquare, LayoutGrid, ReceiptText, UserSearch } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
  const { menus, pending } = usePage<{
    menus: Record<string, boolean>;
    pending?: { absensi: number; cuti: number; payroll: number };
  }>().props;

  const { auth } = usePage().props;

  const mainNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: route('dashboard'),
      icon: LayoutGrid,
    },
  ];

  const secondNavItems: NavItem[] = [
    {
      title: 'Divisi',
      href: route('divisi.index'),
      icon: Building,
      available: menus.divisi,
    },
    {
      title: 'Karyawan',
      href: route('user.index'),
      icon: UserSearch,
      available: menus.user,
    },
  ];

  const thirdNavItems: NavItem[] = [
    {
      title: 'Absensi',
      href: route('absensi.index'),
      icon: BookCheck,
      available: menus.absensi,
      badge: pending?.absensi,
    },
    {
      title: 'Cuti',
      href: route('cuti.index'),
      icon: BookMarked,
      available: menus.cuti,
      badge: pending?.cuti,
    },
    {
      title: 'Payroll',
      href: route('payroll.index'),
      icon: ReceiptText,
      available: menus.payroll,
      badge: pending?.payroll,
    },
  ];

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
        <NavMain items={mainNavItems} label="Dashboard" user={auth.user} />
        <NavMain items={secondNavItems} label="Data Perusahaan" user={auth.user} />
        <NavMain items={thirdNavItems} label="Data Absensi" user={auth.user} />

        <NavMain
          user={auth.user}
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

      {/* <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        awe
      </SidebarFooter> */}
    </Sidebar>
  );
}
