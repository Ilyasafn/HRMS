import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import { Cuti } from '@/types/cuti';
import { User } from '@/types/user';
import { Folder, FolderClock } from 'lucide-react';
import { FC } from 'react';
import CutiApprovalStatusDialog from './components/cuti-approval-status-dialog';

type Props = {
  cuti: Cuti;
  user: User;
};

const ShowCuti: FC<Props> = ({ cuti }) => {
  return (
    <AppLayout title="Detail Cuti" description="Detail cuti">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="order-1 flex w-fit gap-2">
              <CardTitle>{cuti.user?.name}</CardTitle>
              <StatusBadge status={cuti.approval_status} />
            </div>
            <div className="order-2 w-fit">
              <CutiApprovalStatusDialog cuti={cuti}>
                <Button variant={'ghost'} size={'icon'}>
                  {cuti?.approval_status === 'Pending' ? <FolderClock /> : <Folder />}
                </Button>
              </CutiApprovalStatusDialog>
            </div>
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
