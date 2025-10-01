import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { dateDFY } from '@/lib/utils';
import { Cuti } from '@/types/cuti';
import { router } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

type Props = PropsWithChildren & {
  cuti: Cuti;
};

const CutiApprovalStatusDialog = ({ children, cuti }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApproval = (status: 'Approved' | 'Rejected') => {
    setLoading(true);
    router.put(
      route('cuti.approval', { id: cuti.id }),
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
          <DialogTitle>{cuti.user?.name}</DialogTitle>
          <DialogDescription>
            Setujui Cuti {cuti?.user?.name} pada {dateDFY(cuti?.tgl_pengajuan)} ?
          </DialogDescription>
        </DialogHeader>
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

export default CutiApprovalStatusDialog;
