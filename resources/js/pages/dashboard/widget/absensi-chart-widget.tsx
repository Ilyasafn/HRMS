import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ChartData } from '@/types/absensi';
import { FC } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts';



type Props = {
  chart_data?: ChartData[];
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

const AdminAbsensiChart: FC<Props> = ({ chart_data = [] }) => {
  if (chart_data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rekap Absensi Per Bulan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-gray-500">Tidak ada data chart</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rekap Absensi Per Bulan</CardTitle>
        <CardDescription>Statistik absensi semua karyawan tahun {new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ChartContainer config={chartConfig}>
            <BarChart data={chart_data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="hadir" stackId="a" fill="var(--color-hadir)" />
              <Bar dataKey="alpha" stackId="a" fill="var(--color-alpha)" />
              <Bar dataKey="cuti" stackId="b" fill="var(--color-cuti)" />
              <Bar dataKey="izin" stackId="b" fill="var(--color-izin)" />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AdminAbsensiChart;
