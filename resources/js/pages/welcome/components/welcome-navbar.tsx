import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { welcomeMenuList } from '../datas/welcome-menu-lists';

const WelcomeNavbar = () => {
  const { auth } = usePage<SharedData>().props;
  const isMobile = useIsMobile();

  return (
    <div className="flex h-fit items-center justify-between py-6">
      {isMobile ? (
        <SidebarTrigger />
      ) : (
        <nav className="flex w-full items-center justify-between gap-4">
          <div>
            {welcomeMenuList.map((menu, index) => (
              <Button variant={menu.isActive ? 'outline' : 'ghost'} key={index} asChild>
                <Link href={menu.href}>
                  {menu.icon && <menu.icon />}
                  {menu.title}
                </Link>
              </Button>
            ))}
          </div>
          <div>
            {[
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
                      isActive: true,
                    },
                  ]),
            ].map((menu, index) => (
              <Button variant={menu.isActive ? 'outline' : 'ghost'} key={index} asChild>
                <Link href={menu.href}>
                  {menu.icon && <menu.icon />}
                  {menu.title}
                </Link>
              </Button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default WelcomeNavbar;
