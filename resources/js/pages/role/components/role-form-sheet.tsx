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
import { capitalizeWords, em, formatRupiah } from '@/lib/utils';
import { FormPurpose } from '@/types';
import { Role } from '@/types/role';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  role?: Role;
  purpose: FormPurpose;
};

const RoleFormSheet: FC<Props> = ({ children, role, purpose }) => {
  const [open, setOpen] = useState(false);

  const { data, setData, put, post, reset, processing } = useForm({
    name: role?.name ?? '',
    gaji_pokok: role?.gaji_pokok ?? '',
    tunjangan: role?.tunjangan ?? '',
  });

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('role.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Role created successfully');
          reset();
          setOpen(false);
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('role.update', role?.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Role updated successfully');
        },
        onError: (e) => toast.error(em(e)),
      });
    }
  };

  const handleCurrencyChange = (field: string, value: string) => {
    // Hilangkan semua karakter non-digit
    const numericValue = value.replace(/[^\d]/g, '');
    setData(field, numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{capitalizeWords(purpose)} data role</DialogTitle>
          <DialogDescription>Form untuk {purpose} data role</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl label="Nama role">
              <Input type="text" placeholder="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            </FormControl>
            <FormControl label="Tunjangan" className="w-full">
              <Input
                className="w-full"
                type="text"
                value={formatRupiah(data.gaji_pokok)}   
                onChange={(e) => handleCurrencyChange('gaji_pokok', e.target.value)}
              />
            </FormControl>
            <FormControl label="Tunjangan" className="w-full">
              <Input
                className="w-full"
                type="text"
                value={formatRupiah(data.tunjangan)}
                onChange={(e) => handleCurrencyChange('tunjangan', e.target.value)}
              />
            </FormControl>
          </form>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>
              <X /> Batal
            </Button>
          </DialogClose>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} role`} loading={processing} disabled={processing} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleFormSheet;
