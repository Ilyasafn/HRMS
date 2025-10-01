import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import StatusBadge from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dateDFY } from '@/lib/utils';
import { SharedData } from '@/types';
import { Absensi } from '@/types/absensi';
import { User } from '@/types/user';
import { usePage } from '@inertiajs/react';
import { Edit, Folder, FolderClock, Image, Trash2 } from 'lucide-react';
import { FC } from 'react';
import AbsensiApprovalStatusDialog from './components/absensi-approval-status-dialog';
import AbsensiDeleteDialog from './components/absensi-delete-dialog';
import AbsensiFormSheet from './components/absensi-form-sheet';
import AbsensiUploadMediaSheet from './components/absensi-upload-sheet';

type Props = {
  absensis: Absensi[];
  users: User[];
};

const ShowAbsensi: FC<Props> = ({ absensis, users }) => {
  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/dashboard',
        },
        {
          title: 'Absensi',
          href: route('absensi.index'),
        },
        {
          title: `${dateDFY(absensis[0]?.tanggal)}`,
          href: route('divisi.index'),
        },
      ]}
      title={`Detail absensi ${dateDFY(absensis[0]?.tanggal) ?? 'N/A'}`}
      description={`Menampilkan informasi absensi karyawan`}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Karyawan</TableHead>
            <TableHead>Jam Masuk</TableHead>
            <TableHead>Jam Keluar</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Disetujui Oleh</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {absensis.map((absensi, i) => (
            <TableRow key={absensi.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{absensi.user?.name}</TableCell>
              <TableCell>{absensi.jam_masuk || '-'}</TableCell>
              <TableCell>{absensi.jam_keluar || '-'}</TableCell>
              <TableCell>
                <StatusBadge status={absensi.status || ''} />
              </TableCell>
              <HoverCard>
                <TableCell>
                  <HoverCardTrigger className="line-clamp-1 truncate w-40">{absensi.keterangan || '-'}</HoverCardTrigger>
                  <HoverCardContent className="min-w-fit">
                    <div className="flex justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          <StatusBadge status={absensi.status || ''} />
                        </h4>
                        <p className="line-clamp-2">{absensi?.keterangan}</p>
                        <div className="text-xs text-muted-foreground">Joined December 2021</div>
                      </div>
                    </div>
                  </HoverCardContent>
                </TableCell>
              </HoverCard>
              <TableCell>{(absensi.approval_status !== 'Pending' && absensi.approved_by?.name) || '-'}</TableCell>
              <TableCell>
                <StatusBadge status={absensi.approval_status} />
              </TableCell>
              <TableCell>
                <AbsensiApprovalStatusDialog absensi={absensi}>
                  <Button variant={'ghost'} size={'icon'}>
                    {absensi?.approval_status === 'Pending' ? <FolderClock /> : <Folder />}
                  </Button>
                </AbsensiApprovalStatusDialog>
                {permissions?.canUpdate && (
                  <>
                    <AbsensiUploadMediaSheet absensi={absensi}>
                      <Button variant={'ghost'} size={'icon'}>
                        <Image />
                      </Button>
                    </AbsensiUploadMediaSheet>
                    <AbsensiFormSheet purpose="edit" absensi={absensi} users={users}>
                      <Button variant={'ghost'} size={'icon'}>
                        <Edit />
                      </Button>
                    </AbsensiFormSheet>
                  </>
                )}
                {permissions?.canDelete && (
                  <AbsensiDeleteDialog absensi={absensi}>
                    <Button variant={'ghost'} size={'icon'}>
                      <Trash2 />
                    </Button>
                  </AbsensiDeleteDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default ShowAbsensi;
