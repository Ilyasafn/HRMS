import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { capitalizeWords, em, formatRupiah, parseRupiah } from '@/lib/utils';
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
  const [tglMasukOpen, setTglMasukOpen] = useState(false);
  const [tglLahirOpen, setTglLahirOpen] = useState(false);
  const [tglMasuk, setTglMasuk] = useState<Date | undefined>(user?.tgl_masuk ? new Date(user.tgl_masuk) : undefined);
  const [tglLahir, setTglLahir] = useState<Date | undefined>(user?.tgl_lahir ? new Date(user.tgl_lahir) : undefined);

  const { data, setData, put, post, reset, processing } = useForm({
    name: user?.name ?? '',
    email: user?.email ?? '',
    divisi_id: user?.divisi?.id ?? '',
    nik: user?.nik ?? '',
    tgl_lahir: user?.tgl_lahir ?? '',
    alamat: user?.alamat ?? '',
    no_telp: user?.no_telp ?? '',
    jenis_kelamin: user?.jenis_kelamin ?? '',
    tgl_masuk: user?.tgl_masuk ?? '',
    status: user?.status ?? 'Aktif',
    gaji_pokok: user?.custom_gaji_pokok ?? '',
    tunjangan: user?.custom_tunjangan ?? '',
    password: user ? undefined : '',
    password_confirmation: user ? undefined : '',
    roles: user?.roles?.map((r) => r.name) ?? [],
  });

  React.useEffect(() => {
    if (user) {
      if (user?.tgl_masuk) {
        setTglMasuk(new Date(user.tgl_masuk));
      }
      if (user?.tgl_lahir) {
        setTglLahir(new Date(user.tgl_lahir));
      }
    }
  }, [user]);

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      console.log('gaji pokok:', data.gaji_pokok, 'tunjangan:', data.tunjangan);
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <ScrollArea className="h-[34rem] w-full rounded-md">
          <DialogHeader>
            <DialogTitle>{capitalizeWords(purpose)} data user</DialogTitle>
            <DialogDescription>Form untuk {purpose} data user</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl label="Nama karyawan" className=''>
              <Input type="text" placeholder="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            </FormControl>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormControl label="Email address">
                <Input type="email" placeholder="username@domain.com" value={data.email} onChange={(e) => setData('email', e.target.value)} />
              </FormControl>
              <FormControl label="Handphone">
                <Input type="text" placeholder="08xxxxxxxxxx" value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} />
              </FormControl>
            </div>

            <FormControl label="Alamat">
              <Textarea placeholder="Alamat" value={data.alamat ?? ''} onChange={(e) => setData('alamat', e.target.value)} />
            </FormControl>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormControl label="NIK (Nomor Induk Karyawan)">
                <Input type="text" placeholder="NIK" value={data.nik} onChange={(e) => setData('nik', e.target.value)} />
              </FormControl>
              <FormControl label="Jenis kelamin">
                <Select value={data.jenis_kelamin ?? ''} onValueChange={(value: 'Laki-laki' | 'Perempuan' | '') => setData('jenis_kelamin', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormControl label="Divisi">
                <Select value={data.divisi_id.toString()} onValueChange={(value) => setData('divisi_id', Number(value))}>
                  <SelectTrigger className="w-full">
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

              <FormControl label="Jabatan">
                <Select
                  value={data.roles?.[0] ?? ''}
                  onValueChange={(value) => {
                    setData('roles', [value]);

                    const selectedRole = roles.find((r) => r.name === value);
                    if (selectedRole) {
                      // auto isi gaji dan tunjangan
                      setData('gaji_pokok', selectedRole.gaji_pokok?.toString() ?? '');
                      setData('tunjangan', selectedRole.tunjangan?.toString() ?? '');
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </div>

            {/* Gaji Pokok */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormControl label="Gaji Pokok">
                <Input
                  type="text"
                  placeholder="Isi gaji pokok"
                  value={formatRupiah(data.gaji_pokok)}
                  onChange={(e) => setData('gaji_pokok', parseRupiah(e.target.value))}
                />
              </FormControl>

              {/* Tunjangan */}
              <FormControl label="Tunjangan">
                <Input
                  type="text"
                  placeholder="Isi tunjangan"
                  value={formatRupiah(data.tunjangan) as string}
                  onChange={(e) => setData('tunjangan', parseRupiah(e.target.value) as number)}
                />
              </FormControl>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Tgl Lahir */}
              <FormControl label="Tanggal lahir">
                <Popover open={tglLahirOpen} onOpenChange={setTglLahirOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between font-normal">
                      {tglLahir ? tglLahir.toLocaleDateString() : 'Select date'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tglLahir}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setTglLahir(date);
                        setTglLahirOpen(false);
                        if (date) {
                          const formatted = date.toISOString().split('T')[0];
                          setData('tgl_lahir', formatted);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>

              {/* Tgl Masuk */}
              <FormControl label="Tanggal masuk">
                <Popover open={tglMasukOpen} onOpenChange={setTglMasukOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between font-normal">
                      {tglMasuk ? tglMasuk.toLocaleDateString() : 'Select date'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tglMasuk}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setTglMasuk(date);
                        setTglMasukOpen(false);
                        if (date) {
                          const formatted = date.toISOString().split('T')[0];
                          setData('tgl_masuk', formatted);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </div>

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
            {purpose == 'edit' && (
              <>
                <FormControl label="Status">
                  <Select value={data.status.toString()} onValueChange={(value: 'Aktif' | 'Tidak Aktif') => setData('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </>
            )}
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
