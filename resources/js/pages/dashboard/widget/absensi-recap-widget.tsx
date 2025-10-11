// resources/js/Components/RekapAbsensiTable.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { FC } from 'react';

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
  rekap_absensi?: RekapAbsensi[];
};

const RekapAbsensiTable: FC<Props> = ({ rekap_absensi = [] }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Rekap Absensi Per Karyawan</CardTitle>
            <CardDescription>Detail kehadiran semua karyawan</CardDescription>
          </div>
          <Link href={route('absensi.index')}>
            <Button variant="outline">Lihat Semua Absensi</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y">
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Hadir</TableHead>
                <TableHead>Telat</TableHead>
                <TableHead>Izin</TableHead>
                <TableHead>Cuti</TableHead>
                <TableHead>Alpha</TableHead>
                <TableHead>Total Absensi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rekap_absensi.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link href={route('user.show', user.id)}>
                      <Button variant="link">{user.name}</Button>
                    </Link>
                  </TableCell>
                  <TableCell>{user.divisi || '-'}</TableCell>
                  <TableCell>{user.total_hadir}</TableCell>
                  <TableCell>{user.total_telat}</TableCell>
                  <TableCell>{user.total_izin}</TableCell>
                  <TableCell>{user.total_cuti}</TableCell>
                  <TableCell>{user.total_alpha}</TableCell>
                  <TableCell>{user.total_absensi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RekapAbsensiTable;
