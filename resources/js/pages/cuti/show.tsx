import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import { Cuti } from '@/types/cuti';
import { User } from '@/types/user';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Folder, FolderClock } from 'lucide-react';
import { FC } from 'react';
import CutiApprovalStatusDialog from './components/cuti-approval-status-dialog';

type Props = {
  cuti: Cuti;
  user: User;
  isAdmin: boolean;
};

const ShowCuti: FC<Props> = ({ cuti, isAdmin }) => {
  return (
    <AppLayout
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/dashboard',
        },
        {
          title: 'Cuti',
          href: route('cuti.index'),
        },
        {
          title: `Detail Cuti ${cuti.user?.name} pada tanggal ${cuti.tgl_pengajuan}`,
          href: route('cuti.show', cuti.id),
        },
      ]}
      title="Detail Cuti"
      description="Detail cuti"
      actions={
        <>
          <Button asChild variant={'secondary'}>
            <Link href={route('cuti.index')}>
              <ArrowLeft />
              Kembali ke list cuti
            </Link>
          </Button>
        </>
      }
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="order-1 flex w-fit gap-2">
              <CardTitle>{cuti.user?.name}</CardTitle>
              <StatusBadge status={cuti.approval_status} />
            </div>
            {isAdmin && (
              <div className="order-2 w-fit">
                <CutiApprovalStatusDialog cuti={cuti}>
                  <Button variant={'ghost'} size={'icon'}>
                    {cuti?.approval_status === 'Pending' ? <FolderClock /> : <Folder />}
                  </Button>
                </CutiApprovalStatusDialog>
              </div>
            )}
          </div>
          <CardDescription>Tanggal mulai cuti: {cuti.tgl_mulai || '-'}</CardDescription>
          <CardDescription>Tanggal selesai cuti: {cuti.tgl_selesai || '-'}</CardDescription>
          <CardDescription>Jenis cuti: {cuti.jenis_cuti}</CardDescription>
          <CardDescription>alasan: {cuti.alasan}</CardDescription>
        </CardHeader>
      </Card>
    </AppLayout>
  );
};

export default ShowCuti;
