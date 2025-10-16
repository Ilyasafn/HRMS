import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils';
import { SharedData } from '@/types';
import { Payroll } from '@/types/payroll';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { ArrowLeft, Folder, FolderClock } from 'lucide-react';
import { FC } from 'react';
import PayrollApprovalStatusDialog from './components/payroll-approval-status-dialog';
import PayrollApprove from './components/payroll-approve-dialog';

type Props = {
  payroll: Payroll;
  summary: {
    nama: string;
    role: string;
    periode: string;
    gaji_pokok: number;
    tunjangan: number;
    potongan: number;
    total_gaji: number;
    hadir: number;
    izin: number;
    cuti: number;
    alpha: number;
    telat: number;
  };
};

const ShowPayroll: FC<Props> = ({ payroll, summary }) => {
  const { permissions } = usePage<SharedData>().props;

  console.log('Payroll data:', payroll);
  console.log('Approver data:', payroll.approver);
  console.log('Approved by:', payroll.approved_by);
  console.log('status', payroll.status);

  return (
    <AppLayout
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/dashboard',
        },
        {
          title: 'Payroll',
          href: route('payroll.index'),
        },
        {
          title: `Detail Payroll`,
          // href: route('payroll.show', payroll.id),
          href: route('payroll.periode.show', { periode: String(payroll.periode_bulan) }),
        },
        {
          title: `Detail Payroll ${payroll.user.name} periode ${dayjs(payroll.periode).format('MMMM YYYY')}`,
          href: route('payroll.show', payroll.id),
        },
      ]}
      title={`${payroll.user.name}`}
      description={`Detail absensi dan penggajian periode ${dayjs(payroll.periode).format('MMMM YYYY')}`}
      actions={
        <>
          <Button asChild variant={'secondary'}>
            <Link href={route('payroll.periode.show', { periode: String(payroll.periode_bulan) })}>
              <ArrowLeft />
              Kembali ke list Payroll
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Rekap Absen */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-full items-center">
                <div className="order-1 flex gap-2">
                  <CardTitle>Data absensi {dayjs(payroll.periode).format('MMMM YYYY')}</CardTitle>
                  <StatusBadge status={payroll.approval_status} />
                </div>
                <div>
                  <CardDescription className="">Disetujui oleh: {payroll.approver?.name || 'Belum disetujui'}</CardDescription>
                </div>
              </div>
              {permissions?.canUpdate && (
                <div className="order-2 w-fit">
                  <PayrollApprovalStatusDialog payroll={payroll}>
                    <Button variant={'ghost'} size={'icon'}>
                      {payroll.approval_status === 'Pending' ? <FolderClock /> : <Folder />}
                    </Button>
                  </PayrollApprovalStatusDialog>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <CardDescription>Hadir: {summary?.hadir ?? 0}</CardDescription>
              <CardDescription>Izin: {summary?.izin ?? 0}</CardDescription>
              <CardDescription>Cuti: {summary?.cuti ?? 0}</CardDescription>
              <CardDescription>Telat: {summary?.telat ?? 0}</CardDescription>
              <CardDescription>Alpha: {summary?.alpha ?? 0}</CardDescription>
            </div>
            <Separator />
            <div>
              <CardTitle>Potongan: {formatRupiah(summary?.potongan ?? 0)}</CardTitle>
            </div>
          </CardContent>
        </Card>

        {/* Detail Penggajian */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="order-1 flex w-fit gap-2">
                <CardTitle>Detail Penggajian</CardTitle>
                <StatusBadge status={payroll.status} />
              </div>
              <div className="order-2 w-fit">
                {permissions?.canUpdate && (
                  <PayrollApprove payroll={payroll}>
                    <Button variant={'ghost'} size={'icon'}>
                      {payroll.status === 'Draft' ? <FolderClock /> : <Folder />}
                    </Button>
                  </PayrollApprove>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <CardDescription>Gaji Pokok: {formatRupiah(summary.gaji_pokok)}</CardDescription>
              <CardDescription>Tunjangan: {formatRupiah(summary.tunjangan)}</CardDescription>
              <CardDescription>Potongan: {formatRupiah(summary.potongan)}</CardDescription>
            </div>
            <Separator />
            <div>
              <CardTitle>Total Gaji: {formatRupiah(summary.total_gaji)}</CardTitle>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ShowPayroll;
