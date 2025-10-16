import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Payroll } from '@/types/payroll';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  payrollIds: Payroll['id'][];
};

const PayrollBulkEditSheet: FC<Props> = ({ children, payrollIds }) => {
  const { data, put } = useForm({
    payroll_ids: payrollIds,
  });

  const handleSubmit = () => {
    put(route('payroll.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Payroll updated successfully');
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ubah payroll</SheetTitle>
          <SheetDescription>Ubah data {data.payroll_ids.length} payroll</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button type="submit" onClick={handleSubmit}>
            <Check /> Simpan payroll
          </Button>
          <SheetClose asChild>
            <Button variant={'outline'}>
              <X /> Batalin
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PayrollBulkEditSheet;
