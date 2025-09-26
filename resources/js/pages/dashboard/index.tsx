import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import AbsensiCard from './widget/absensi-card-widget';
import DateTimeWidget from './widget/date-time-widget';
import UserInfoWidget from './widget/user-info-widget';

type Props = {
  absensiToday?: Absensi;
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
  const {
    auth: { roles },
  } = usePage<SharedData>().props;

  return (
    <AppLayout title="Dashboard" description={`Selamat datang, kamu masuk sebagai ${roles.join(', ')}`} breadcrumbs={breadcrumbs}>
      <div className="grid grid-cols-2 gap-6">
        <UserInfoWidget />
        <DateTimeWidget />
      </div>
      <AbsensiCard absensiHariIni={absensiToday} />
    </AppLayout>
  );
}
