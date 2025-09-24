import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dateDFY } from '@/lib/utils';
import { Absensi } from '@/types/absensi';
import { User } from '@/types/user';
import { Link } from '@inertiajs/react';
import { Folder } from 'lucide-react';
import { FC } from 'react';

type Props = {
  absensis: Absensi[];
  users: User[];
};

const ShowAbsensi: FC<Props> = ({ absensis }) => {
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
              <TableCell>{absensi.jam_masuk}</TableCell>
              <TableCell>{absensi.jam_keluar}</TableCell>
              <TableCell>
                <StatusBadge status={absensi.status} />
              </TableCell>
              <TableCell>{(absensi.approval_status !== 'Pending' && absensi.approved_by?.name) || '-'}</TableCell>
              <TableCell>
                <StatusBadge status={absensi.approval_status} />
              </TableCell>
              <TableCell>
                <Button variant={'ghost'} size={'icon'}>
                  <Link>
                    <Folder />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default ShowAbsensi;
