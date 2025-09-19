import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

type Props = {
  items: NavItem[];
  label?: string;
};

export function NavMain({ items = [], label }: Props) {
  const { url } = usePage();

  const isActive = (href: string) => {
    try {
      const path = new URL(href).pathname;

      // kalau ada wildcard "*"
      if (path.endsWith('/*')) {
        const base = path.replace('/*', '');
        return url === base || url.startsWith(base + '/');
      }

      // default exact match
      return url === path;
    } catch {
      return false;
    }
  };

  // kalau items kosong, skip
  if (items.length === 0) return null;

  // kalau semua item.available === false, skip
  const hasAvailable = items.some((item) => item.available !== false);
  if (!hasAvailable) return null;

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>{label ? label : 'Main Navigation'}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.available === false) return null;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.title }}>
                <Link href={item.href} prefetch>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
