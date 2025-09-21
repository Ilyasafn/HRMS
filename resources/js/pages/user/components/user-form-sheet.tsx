import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { capitalizeWords, em } from '@/lib/utils';
import { FormPurpose } from '@/types';
import { Divisi } from '@/types/divisi';
import { Role } from '@/types/role';
import { User } from '@/types/user';
import { useForm, usePage } from '@inertiajs/react';
import { ChevronDownIcon, X } from 'lucide-react';
import React, { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  user?: User;
  purpose: FormPurpose;
};

const UserFormSheet: FC<Props> = ({ children, user, purpose }) => {
  const { roles } = usePage<{ roles: Role[] }>().props;
  const { divisis } = usePage<{ divisis: Divisi[] }>().props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { data, setData, put, post, reset, processing } = useForm({
    name: user?.name ?? '',
    email: user?.email ?? '',
    divisi: user?.divisi?.id.toString() ?? '',
    tgl_masuk: user?.tgl_masuk ?? '',
    password: user ? undefined : '',
    password_confirmation: user ? undefined : '',
    roles: user?.roles?.flatMap((r) => r.name) ?? [],
  });

  React.useEffect(() => {
    if (user?.tgl_masuk) {
      setDate(new Date(user.tgl_masuk));
    }
  }, [user]);

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('user.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('User created successfully');
          reset();
          setDialogOpen(false);
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('user.update', user?.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('User updated successfully');
        },
        onError: (e) => toast.error(em(e)),
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{capitalizeWords(purpose)} data user</DialogTitle>
          <DialogDescription>Form untuk {purpose} data user</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl label="Nama user">
              <Input type="text" placeholder="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            </FormControl>
            <FormControl label="Email address">
              <Input type="email" placeholder="username@domain.com" value={data.email} onChange={(e) => setData('email', e.target.value)} />
            </FormControl>
            <FormControl label="Divisi">
              <Select value={data.divisi.toString()} onValueChange={(value) => setData('divisi', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Divisi" />
                </SelectTrigger>
                <SelectContent>
                  {divisis.map((divisi) => (
                    <SelectItem key={divisi.id} value={divisi.id.toString()}>
                      {divisi.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormControl label="Tanggal masuk">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                    {date ? date.toLocaleDateString() : 'Select date'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDate(date);
                      setPopoverOpen(false);
                      if (date) {
                        const formatted = date.toISOString().split('T')[0];
                        setData('tgl_masuk', formatted);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            {purpose == 'create' && (
              <>
                <FormControl label="Password">
                  <Input type="password" placeholder="User password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                </FormControl>
                <FormControl label="Password confirmation">
                  <Input
                    type="password"
                    placeholder="Rewrite user password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                  />
                </FormControl>
              </>
            )}
            <FormControl label="Select role">
              <div className="flex flex-row flex-wrap gap-2">
                {roles.map((r) => (
                  <Label key={r.id} className="flex h-8 items-center gap-2">
                    <Checkbox
                      checked={data.roles?.includes(r.name)}
                      onCheckedChange={(c) => setData('roles', c ? [...data.roles, r.name] : data.roles.filter((role) => role !== r.name))}
                    />
                    {r.name}
                  </Label>
                ))}
              </div>
            </FormControl>
          </form>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>
              <X /> Batal
            </Button>
          </DialogClose>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} user`} loading={processing} disabled={processing} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormSheet;
