import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { dateDFY } from '@/lib/utils';
import { Cuti } from '@/types/cuti';
import { router } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  cuti: Cuti;
};

const CutiApprovalStatusDialog = ({ children, cuti }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = () => {
    setLoading(true);
    router.put(
      route('cuti.approval', cuti.id),
      {
        approval_status: 'Approved',
      },
      {
        preserveScroll: true,
        onSuccess: () => toast.success('Cuti Approved'),
        onError: () => toast.error('Cuti Approval Failed'),
      },
    );
  };

  const handleReject = () => {
    router.put(
      route('cuti.approval', cuti.id),
      {
        approval_status: 'Rejected',
      },
      {
        preserveScroll: true,
        onSuccess: () => toast.success('Cuti rejected!'),
        onError: () => toast.error('Gagal reject cuti'),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cuti.user?.name}</DialogTitle>
          <DialogDescription>
            Setujui Cuti {cuti?.user?.name} pada {dateDFY(cuti?.tgl_pengajuan)} ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button className="border-red-200 bg-red-200 text-red-800" size={'sm'} disabled={loading} onClick={() => handleReject()}>
            Reject
          </Button>
          <Button className="border-green-200 bg-green-200 text-green-800" size={'sm'} disabled={loading} onClick={() => handleApprove()}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CutiApprovalStatusDialog;
