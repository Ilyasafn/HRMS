import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { welcomeMenuList } from '../datas/welcome-menu-lists';

const WelcomeNavbar = () => {
  const { auth } = usePage<SharedData>().props;
  const isMobile = useIsMobile();

  const authMenu = auth.user
    ? [{ title: 'Dashboard', href: route('dashboard'), icon: LogIn }]
    : [{ title: 'Log in', href: route('login'), icon: LogIn, isActive: true }];

  return (
    <div className="flex h-fit items-center justify-between py-6">
      {/* === Mobile View (No homepage menu) === */}
      {isMobile ? (
        <nav className="flex w-full items-center justify-end">
          {authMenu.map((menu, index) => (
            <Button variant="outline" size="sm" key={index} asChild>
              <Link href={menu.href}>
                {menu.icon && <menu.icon className="mr-1 h-4 w-4" />}
                {menu.title}
              </Link>
            </Button>
          ))}
        </nav>
      ) : (
        /* === Desktop View (Menu kiri + login/dashboard kanan) === */
        <nav className="flex w-full items-center justify-between gap-4">
          {/* Menu utama untuk desktop */}
          <div className="flex gap-2">
            {welcomeMenuList.map((menu, index) => (
              <Button variant={menu.isActive ? 'outline' : 'ghost'} key={index} asChild>
                <Link href={menu.href}>
                  {menu.icon && <menu.icon className="mr-1 h-4 w-4" />}
                  {menu.title}
                </Link>
              </Button>
            ))}
          </div>

          {/* Menu Login / Dashboard */}
          <div>
            {authMenu.map((menu, index) => (
              <Button variant={menu ? 'outline' : 'ghost'} key={index} asChild>
                <Link href={menu.href}>
                  {menu.icon && <menu.icon className="mr-1 h-4 w-4" />}
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
