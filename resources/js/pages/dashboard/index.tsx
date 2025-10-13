import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { ChartData } from '@/types/absensi';
import { usePage } from '@inertiajs/react';
import AbsensiCard from './widget/absensi-card-widget';
import AdminAbsensiChart from './widget/absensi-chart-widget';
import RekapAbsensiTable from './widget/absensi-recap-widget';
import StatsWidget from './widget/stats-widget';
import UserInfoWidget from './widget/user-info-widget';

type DashboardStats = {
  hari_ini: {
    hadir: number;
    izin: number;
    cuti: number;
    alpha: number;
  };
  all_time: {
    total_karyawan: number;
    hadir: number;
    izin: number;
    cuti: number;
    alpha: number;
  };
};

type RekapAbsensi = {
  id: number;
  name: string;
  divisi: string;
  total_hadir: number;
  total_telat: number;
  total_izin: number;
  total_cuti: number;
  total_alpha: number;
  total_absensi: number;
};

type Props = {
  absensiHariIni: Absensi;
  cutiHariIni: [];
  pengajuanCutiAktif: [];
  isAdmin: boolean;
  rekap_absensi?: RekapAbsensi[];
  dashboard_stats?: DashboardStats;
  chart_data?: ChartData[];
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

export default function Dashboard({ absensiHariIni, isAdmin, rekap_absensi, dashboard_stats, chart_data }: Props) {
  // Di Dashboard component, cek:
  console.log('dashboard_stats.hari_ini:', dashboard_stats?.hari_ini);
  console.log('dashboard_stats.all_time:', dashboard_stats?.all_time);
  const { auth } = usePage<SharedData>().props;

  return (
    <AppLayout title="Dashboard" description={`Selamat datang, ${auth.user?.name}`} breadcrumbs={breadcrumbs}>
      <UserInfoWidget />

      {/* Admin Dashboard */}
      {isAdmin && (
        <>
          <div className="space-y-6">
            {/* Stats Cards */}
            {dashboard_stats && <StatsWidget stats={dashboard_stats} />}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Chart */}
              <AdminAbsensiChart chart_data={chart_data} />

              {/* Table Rekapan Absensi seluruh karyawan */}
              <RekapAbsensiTable rekap_absensi={rekap_absensi} />
            </div>
          </div>
        </>
      )}

      {isAdmin ? (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Absensi Hari Ini</AccordionTrigger>
            <AccordionContent>
              <AbsensiCard absensiHariIni={absensiHariIni} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <AbsensiCard absensiHariIni={absensiHariIni} />
      )}
    </AppLayout>
  );
}
