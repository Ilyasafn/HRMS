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

const PayrollApprove = ({ children, payroll }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFinalize = () => {
    setLoading(true);
    router.put(
      route('payroll.approveStatus', payroll.id),
      {
        status: 'Finalized',
      },
      {
        preserveScroll: true,
        onSuccess: () => toast.success('Payroll Drafted'),
        onError: () => toast.error('Payroll Drafted Failed'),
      },
    );
  };

  const handleDraft = () => {
    router.put(
      route('payroll.approveStatus', payroll.id),
      {
        status: 'Draft',
      },
      {
        preserveScroll: true,
        onSuccess: () => toast.success('Payroll Draft!'),
        onError: () => toast.error('Gagal Finalized payroll'),
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
          <Button className="border-yellow-200 bg-yellow-200 text-yellow-800" size={'sm'} disabled={loading} onClick={() => handleDraft()}>
            Draft
          </Button>
          <Button className="border-green-200 bg-green-200 text-green-800" size={'sm'} disabled={loading} onClick={() => handleFinalize()}>
            Finalized
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayrollApprove;
