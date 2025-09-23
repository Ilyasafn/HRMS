import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords } from '@/lib/utils';
import { User } from '@/types/user';
import { FC } from 'react';

type Props = {
  user: User;
};

const ShowUser: FC<Props> = ({ user }) => {
  return (
    <AppLayout
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/dashboard',
        },
        {
          title: 'Karyawan',
          href: route('user.index'),
        },
        {
          title: `${user.name}`,
          href: route('user.show', user.id),
        },
      ]}
      title={`Tentang ${user.name}`}
      description={user.roles?.length ? capitalizeWords(`${user.roles[0]?.name} ${user.divisi?.name}`) : 'User'}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-row flex-wrap justify-between gap-2">
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
            <div>
              {' '}
              <StatusBadge status={user.status} />
            </div>
          </div>
          <Separator />
          <CardTitle className="mb-1.5">Informasi Pribadi</CardTitle>
          <CardDescription>Nik: {user.nik}</CardDescription>
          <CardDescription>Alamat: {user.alamat}</CardDescription>
          <CardDescription>No. Telepon: {user.no_telp}</CardDescription>
          <CardDescription>Jenis Kelamin: {user.jenis_kelamin}</CardDescription>
          <CardDescription>Tanggal Lahir: {user.tgl_lahir}</CardDescription>
          <CardDescription>Tanggal Masuk: {user.tgl_masuk}</CardDescription>
        </CardHeader>
      </Card>
    </AppLayout>
  );
};

export default ShowUser;
