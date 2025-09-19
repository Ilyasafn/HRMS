import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Permission } from '@/types/role';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  permissionIds: Permission['id'][];
};

const PermissionBulkEditSheet: FC<Props> = ({ children, permissionIds }) => {
  const { data, put } = useForm({
    permission_ids: permissionIds,
  });

  const handleSubmit = () => {
    put(route('permission.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Permission updated successfully');
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ubah permission</SheetTitle>
          <SheetDescription>Ubah data {data.permission_ids.length} permission</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button type="submit" onClick={handleSubmit}>
            <Check /> Simpan permission
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

export default PermissionBulkEditSheet;
