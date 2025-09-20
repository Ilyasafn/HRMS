import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { capitalizeWords, em } from '@/lib/utils';
import { FormPurpose } from '@/types';
import { Permission } from '@/types/role';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  permission?: Permission;
  purpose: FormPurpose;
};

const PermissionFormSheet: FC<Props> = ({ children, permission, purpose }) => {
  const [open, setOpen] = useState(false);

  const { data, setData, put, post, reset, processing } = useForm({
    group: permission?.group ?? '',
    name: permission?.name ?? '',
  });

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('permission.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Permission created successfully');
          reset();
          setOpen(false);
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('permission.update', permission?.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Permission updated successfully');
          setOpen(false);
        },
        onError: (e) => toast.error(em(e)),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{capitalizeWords(purpose)} data permission</DialogTitle>
          <DialogDescription>Form untuk {purpose} data permission</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl label="Group permission">
              <Input type="text" placeholder="Permission group" value={data.group} onChange={(e) => setData('group', e.target.value)} />
            </FormControl>
            <FormControl label="Nama permission">
              <Input type="text" placeholder="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            </FormControl>
          </form>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>
              <X /> Batal
            </Button>
          </DialogClose>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} permission`} loading={processing} disabled={processing} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionFormSheet;
