import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { User } from './user.dts';

export interface Auth {
  user: User;
  roles: string[];
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
  available?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  permissions?: Record<string, boolean>;
  [key: string]: unknown;
}

export type FormPurpose = 'create' | 'edit' | 'duplicate';

export type Media = {
  id: number;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string;
  disk: string;
  conversions_disk: string;
  size: number;
  order_column: number;
  created_at: string;
  updated_at: string;
  original_url: string;
  preview_url: string;
};
