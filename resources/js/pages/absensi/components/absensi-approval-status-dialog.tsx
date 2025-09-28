import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StatusBadge from '@/components/ui/status-badge';
import { dateDFY } from '@/lib/utils';
import { Absensi } from '@/types/absensi';
import { router } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

type Props = PropsWithChildren & {
  absensi: Absensi;
};

const AbsensiApprovalStatusDialog = ({ children, absensi }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApproval = (status: 'Approved' | 'Rejected') => {
    setLoading(true);
    router.put(
      route('absensi.approval', { id: absensi.id }),
      { approval_status: status },
      {
        onFinish: () => setLoading(false),
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-row flex-wrap gap-2">
            <div className="p-1">
              <DialogTitle>{absensi.user?.name}</DialogTitle>
            </div>
            <div className="">
              <StatusBadge status={absensi.approval_status}></StatusBadge>
            </div>
          </div>
          <DialogDescription>
            Detail absensi {absensi?.user?.name} pada {dateDFY(absensi?.tanggal)}
          </DialogDescription>
        </DialogHeader>
        <div>
          <DialogDescription>Jam Masuk: {absensi.jam_masuk || '-'}</DialogDescription>
          <DialogDescription>Jam Keluar: {absensi.jam_keluar || '-'}</DialogDescription>
          <DialogDescription>Status: {absensi.status}</DialogDescription>
          <DialogDescription>Keterangan: {absensi.keterangan}</DialogDescription>
        </div>
        <DialogFooter>
          <Button className="border-red-200 bg-red-200 text-red-800" size={'sm'} disabled={loading} onClick={() => handleApproval('Rejected')}>
            Reject
          </Button>
          <Button className="border-green-200 bg-green-200 text-green-800" size={'sm'} disabled={loading} onClick={() => handleApproval('Approved')}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AbsensiApprovalStatusDialog;
