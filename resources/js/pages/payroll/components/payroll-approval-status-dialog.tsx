import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Payroll } from '@/types/payroll';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  payroll: Payroll;
};

const PayrollApprovalStatusDialog = ({ children, payroll }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = () => {
    setLoading(true);
    router.put(
      route('payroll.approve', payroll.id),
      {
        approval_status: 'Approved',
      },
      {
        preserveScroll: true,
        onSuccess: () => toast.success('payroll Approved'),
        onError: () => toast.error('payroll Approval Failed'),
      },
    );
  };

  const handleReject = () => {
    router.put(
      route('payroll.approve', payroll.id),
      {
        approval_status: 'Rejected',
      },
      {
        preserveScroll: true,
        onSuccess: () => toast.success('payroll rejected!'),
        onError: () => toast.error('Gagal reject payroll'),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{payroll.user?.name}</DialogTitle>
          <DialogDescription>
            Setujui payroll {payroll?.user?.name} pada periode {dayjs(payroll.periode).format('MMMM YYYY')}?
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

export default PayrollApprovalStatusDialog;
