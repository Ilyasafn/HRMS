import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Divisi } from '@/types/divisi';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  divisiIds: Divisi['id'][];
};

const DivisiBulkEditSheet: FC<Props> = ({ children, divisiIds }) => {
  const { data, put } = useForm({
    divisi_ids: divisiIds,
  });

  const handleSubmit = () => {
    put(route('divisi.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Divisi updated successfully');
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ubah divisi</SheetTitle>
          <SheetDescription>Ubah data {data.divisi_ids.length} divisi</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button type="submit" onClick={handleSubmit}>
            <Check /> Simpan divisi
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

export default DivisiBulkEditSheet;
