import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import ThemeToggler from '@/components/theme-toggler';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { welcomeMenuList } from '../datas/welcome-menu-lists';

const WelcomeSidebar = () => {
  const { auth } = usePage<SharedData>().props;
  return (
    <Sidebar variant="inset">
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
      <SidebarContent>
        <NavMain
          items={[
            ...welcomeMenuList,
            ...(auth.user
              ? [
                  {
                    title: 'Dashboard',
                    href: route('dashboard'),
                    icon: LogIn,
                  },
                ]
              : [
                  {
                    title: 'Log in',
                    href: route('login'),
                    icon: LogIn,
                  },
                ]),
          ]}
          label="Dashboard"
        />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggler />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default WelcomeSidebar;
