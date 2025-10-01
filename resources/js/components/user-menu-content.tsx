import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { Link, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

export function UserMenuContent() {
  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };

  return (
    <>
      <DropdownMenuItem asChild>
        <Link className="w-full" method="post" href={route('logout')} as="button" onClick={handleLogout}>
          <LogOut className="" />
          Log out
        </Link>
      </DropdownMenuItem>
    </>
  );
}
