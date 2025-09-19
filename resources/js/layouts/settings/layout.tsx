import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import AppLayout from '../app-layout';

const sidebarNavItems: NavItem[] = [
  {
    title: 'Profile',
    href: '/settings/profile',
    icon: null,
  },
  {
    title: 'Password',
    href: '/settings/password',
    icon: null,
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
    icon: null,
  },
];

type Props = PropsWithChildren & {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
};

const settingBreadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Settings',
    href: '/settings',
  },
];

export default function SettingsLayout({ children, title, description, breadcrumbs }: Props) {
  // When server-side rendering, we only render the layout on the client...
  if (typeof window === 'undefined') {
    return null;
  }

  const currentPath = window.location.pathname;

  return (
    <AppLayout
      title={title ?? 'Settings'}
      description={description ?? 'Manage your profile and account settings'}
      breadcrumbs={[...settingBreadcrumbs, ...(breadcrumbs ?? [])]}
    >
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        <aside className="w-full max-w-xl lg:w-48">
          <nav className="flex flex-col space-y-1 space-x-0">
            {sidebarNavItems.map((item, index) => (
              <Button
                key={`${item.href}-${index}`}
                size="sm"
                variant="ghost"
                asChild
                className={cn('w-full justify-start', {
                  'bg-muted': currentPath === item.href,
                })}
              >
                <Link href={item.href} prefetch>
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 lg:hidden" />

        <div className="flex-1 md:max-w-2xl">
          <section className="max-w-xl space-y-12">{children}</section>
        </div>
      </div>
    </AppLayout>
  );
}
