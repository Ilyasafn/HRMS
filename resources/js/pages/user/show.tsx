import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords } from '@/lib/utils';
import { ChartData, TotalAbsensi } from '@/types/absensi';
import { User } from '@/types/user';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FC } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts';

type Props = {
  user: User;
  total_absensi: TotalAbsensi;
  chart_data: ChartData;
};

const chartConfig = {
  hadir: {
    label: 'Hadir',
    color: '#72C65F',
  },
  izin: {
    label: 'Izin',
    color: '#3498db',
  },
  cuti: {
    label: 'Cuti',
    color: '#9b59b6',
  },
  alpha: {
    label: 'Alpha',
    color: '#E34E44',
  },
} satisfies ChartConfig;

const ShowUser: FC<Props> = ({ user, total_absensi, chart_data }) => {
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
      description={user.roles?.length ? capitalizeWords(`${user.roles[0]?.name} ${user.divisi?.name || ''}`) : 'User'}
      actions={
        <>
          <Button asChild variant={'secondary'}>
            <Link href={route('user.index')}>
              <ArrowLeft />
              Kembali ke list karyawan
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid grid-rows-2 gap-4 md:grid-flow-col">
        {/* Informasi Pribadi */}
        <Card className="md:col-span-12 md:row-span-2">
          <CardHeader>
            <CardTitle className="mb-1.5">Informasi Pribadi</CardTitle>
            <Separator />
            <div className="grid grid-rows-2 md:grid-flow-col">
              <div>
                <CardDescription>Email: {user.email}</CardDescription>
                <CardDescription>Alamat: {user.alamat}</CardDescription>
                <CardDescription>No. Telepon: {user.no_telp}</CardDescription>
                <CardDescription>Jenis Kelamin: {user.jenis_kelamin}</CardDescription>
                <CardDescription>Tanggal Lahir: {user.tgl_lahir}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Informasi Karyawan */}
        <Card className="col-span-1 row-span-1">
          <CardHeader>
            <div className="flex items-center">
              <div className="flex-grow">
                <CardTitle className="mb-1.5">Informasi Karyawan</CardTitle>
              </div>
              <div className="mb-2.5 flex-none">
                <StatusBadge status={user.status} />
              </div>
            </div>
            <Separator />
            <CardDescription>Nik: {user.nik}</CardDescription>
            <CardDescription>Tanggal Masuk: {user.tgl_masuk}</CardDescription>
            <CardDescription>Sisa Cuti Tahunan: {user.sisa_cuti_tahunan} hari</CardDescription>
            <CardDescription>Total Cuti Diambil: {user.total_cuti_diambil} hari</CardDescription>
          </CardHeader>
        </Card>

        {/* Informasi Rekapan Absensi */}
        <Card className="colspan-1 row-span-1">
          <CardHeader>
            <div className="flex items-center">
              <div className="flex-grow">
                <CardTitle className="mb-1.5">Informasi Absensi</CardTitle>
              </div>
            </div>
            <Separator />
            {/* Total Absensi */}
            <CardDescription className="font-semibold text-green-600">Total Hadir: {total_absensi.hadir} hari</CardDescription>
            <CardDescription className="font-semibold text-orange-500">Total Telat: {total_absensi.telat} hari</CardDescription>
            <CardDescription className="font-semibold text-blue-500">Total Izin: {total_absensi.izin} hari (Sakit/Izin/Lainnya)</CardDescription>
            <CardDescription className="font-semibold text-purple-600">Total Cuti: {user.total_cuti_diambil} hari</CardDescription>
            <CardDescription className="font-semibold text-red-600">Total Tidak Hadir (Alpha): {total_absensi.alpha} hari</CardDescription>
            <CardDescription className="border-t pt-2 font-semibold text-gray-600">Total Kehadiran: {total_absensi.total} hari</CardDescription>
            <div className="grid grid-cols-2 gap-2">
              <div className="">
                <Link href={route('absensi.index')} className="">
                  <Button className="w-full">Lihat detail absensi</Button>
                </Link>
              </div>
              <div className="">
                <Link href={route('cuti.index')} className="">
                  <Button className="w-full">Lihat detail cuti</Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Rekap Absensi */}
      <Card className="">
        <CardHeader>
          <CardTitle>Rekap Absensi</CardTitle>
        </CardHeader>
        <ResponsiveContainer className="max-h-screen w-full" height={310}>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chart_data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
              <ChartTooltip content={<ChartTooltipContent hideIndicator />} cursor={false} defaultIndex={1} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar stackId={'a'} dataKey="hadir" fill="var(--color-hadir)" />
              <Bar stackId={'a'} dataKey="alpha" fill="var(--color-alpha)" />
              <Bar stackId={'b'} dataKey="cuti" fill="var(--color-cuti)" />
              <Bar stackId={'b'} dataKey="izin" fill="var(--color-izin)" />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </Card>
    </AppLayout>
  );
};

export default ShowUser;
