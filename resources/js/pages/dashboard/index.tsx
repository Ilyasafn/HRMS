import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { User } from '@/types/user';
import { usePage } from '@inertiajs/react';
import AbsensiCard from './widget/absensi-card-widget';

type Props = {
  absensiToday?: Absensi;
  user: User;
};

type Absensi = {
  id: number;
  user_id: number;
  tanggal: string;
  jam_masuk: string;
  jam_keluar?: string | null;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  status: 'Hadir' | 'Telat' | 'Sakit' | 'Izin' | 'Cuti' | 'Alpha';
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard({ absensiToday }: Props) {
  const { auth } = usePage<SharedData>().props;

  return (
    <AppLayout title="Dashboard" description={`Selamat datang, ${auth.user?.name}`} breadcrumbs={breadcrumbs}>
      <AbsensiCard absensiHariIni={absensiToday} />
    </AppLayout>
  );
}
