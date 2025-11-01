import { NavItem } from '@/types';
import { Home } from 'lucide-react';

export const welcomeMenuList: NavItem[] = [
  {
    title: 'Homepage',
    href: route('home'),
    icon: Home,
  },
  // {
  //   title: 'About',
  //   href: route('about'),
  //   icon: UserSquare,
  // },
];
