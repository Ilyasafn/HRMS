import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FC } from 'react';

type Props = {
  stats: {
    total_karyawan: number;
    total_hadir: number;
    total_telat: number;
    total_izin: number;
    total_cuti: number;
    total_alpha: number;
  };
};

const StatsWidget: FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Karyawan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_karyawan}</div>
          <CardDescription>Karyawan Aktif</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Hadir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.total_hadir}</div>
          <CardDescription>Kehadiran</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Izin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.total_izin}</div>
          <CardDescription>Sakit/Izin/Lainnya</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Cuti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.total_cuti}</div>
          <CardDescription>Cuti Tahunan/Lainnya</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Alpha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.total_alpha}</div>
          <CardDescription>Tidak hadir tanpa keterangan</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsWidget;
