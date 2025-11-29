import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Divisi } from '@/types/divisi';
import { User } from '@/types/user';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Folder } from 'lucide-react';
import { FC } from 'react';

type Props = {
  users: User[];
  divisi: Divisi;
};

const ShowDivisi: FC<Props> = ({ divisi, users }) => {
  return (
    <AppLayout
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/dashboard',
        },
        {
          title: 'Divisi',
          href: route('divisi.index'),
        },
        {
          title: `Divisi ${divisi.name}`,
          href: route('divisi.show', divisi.id),
        },
      ]}
      title={`Detail Divisi ${divisi.name}`}
      description={`Menampilkan informasi lengkap mengenai divisi ${divisi.name} dan karyawan yang ter-daftar di dalamnya`}
      actions={
        <>
          <Button asChild variant={'secondary'}>
            <Link href={route('divisi.index')}>
              <ArrowLeft />
              Kembali ke list divisi
            </Link>
          </Button>
        </>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>NIK</TableHead>
            <TableHead>Jenis Kelamin</TableHead>
            <TableHead>No Handphone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user, i) => (
              <TableRow key={user.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.nik}</TableCell>
                <TableCell>{user.jenis_kelamin}</TableCell>
                <TableCell>{user.no_telp}</TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'}>
                    <Link href={route('user.show', user.id)}>
                      <Folder />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada user di divisi ini
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default ShowDivisi;
