import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Absensi } from '@/types/absensi';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  absensiIds: Absensi['id'][];
};

const AbsensiBulkEditSheet: FC<Props> = ({ children, absensiIds }) => {
  const { data, put } = useForm({
    absensi_ids: absensiIds,
  });

  const handleSubmit = () => {
    put(route('absensi.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Absensi updated successfully');
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ubah absensi</SheetTitle>
          <SheetDescription>Ubah data {data.absensi_ids.length} absensi</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button type="submit" onClick={handleSubmit}>
            <Check /> Simpan absensi
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

export default AbsensiBulkEditSheet;
