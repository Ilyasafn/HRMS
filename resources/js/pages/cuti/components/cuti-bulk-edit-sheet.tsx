import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Cuti } from '@/types/cuti';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  cutiIds: Cuti['id'][];
};

const CutiBulkEditSheet: FC<Props> = ({ children, cutiIds }) => {
  const { data, put } = useForm({
    cuti_ids: cutiIds,
  });

  const handleSubmit = () => {
    put(route('cuti.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Cuti updated successfully');
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ubah cuti</SheetTitle>
          <SheetDescription>Ubah data {data.cuti_ids.length} cuti</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button type="submit" onClick={handleSubmit}>
            <Check /> Simpan cuti
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

export default CutiBulkEditSheet;
