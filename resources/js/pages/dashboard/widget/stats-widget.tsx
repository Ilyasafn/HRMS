import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FC } from 'react';

type Props = {
  stats: {
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
};

const StatsWidget: FC<Props> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Statistik Absensi Hari Ini</AccordionTrigger>
          <AccordionContent>
            {/* Absensi Hari ini */}
            <div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Hadir Hari Ini</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.hari_ini.hadir}</div>
                    <CardDescription>Hadir + Telat</CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Izin Hari Ini</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.hari_ini.izin}</div>
                    <CardDescription>Sakit/Izin/Lainnya</CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Cuti Hari Ini</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.hari_ini.cuti}</div>
                    <CardDescription>Cuti resmi</CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Alpha Hari Ini</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.hari_ini.alpha}</div>
                    <CardDescription>Belum absen</CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Statistik Absensi Bulan Ini</AccordionTrigger>
          <AccordionContent>
            {/* Absensi All Time */}
            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Karyawan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.all_time.total_karyawan}</div>
                    <CardDescription>Aktif</CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Hadir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.all_time.hadir}</div>
                    <CardDescription>Seluruh periode</CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Izin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.all_time.izin}</div>
                    <CardDescription>Seluruh periode</CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Cuti</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.all_time.cuti}</div>
                    <CardDescription>Seluruh periode</CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Alpha</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.all_time.alpha}</div>
                    <CardDescription>Seluruh periode</CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default StatsWidget;
