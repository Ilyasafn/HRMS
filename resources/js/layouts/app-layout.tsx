import Heading from '@/components/heading';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PropsWithChildren, type ReactNode } from 'react';

type AppLayoutProps = PropsWithChildren & {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
};

export default ({
  children,
  breadcrumbs = [
    {
      title: 'Dashboard',
      href: route('dashboard'),
    },
  ],
  title = 'Page Heading',
  description = 'Page description',
  actions,
}: AppLayoutProps) => (
  <AppLayoutTemplate breadcrumbs={breadcrumbs}>
    <Head title={title} />
    <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 space-y-4 overflow-x-auto rounded-xl p-6">
      <div className="flex items-start justify-between">
        <Heading title={title} description={description} />
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
    <Toaster position="top-center" />
  </AppLayoutTemplate>
);
