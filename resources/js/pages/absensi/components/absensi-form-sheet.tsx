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
import { capitalizeWords, em } from '@/lib/utils';
import { FormPurpose } from '@/types';
import { Absensi } from '@/types/absensi';
import { User } from '@/types/user';
import { useForm } from '@inertiajs/react';
import { ChevronDownIcon, X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  absensi?: Absensi;
  purpose: FormPurpose;
  users?: User[];
};

const AbsensiFormSheet: FC<Props> = ({ children, absensi, purpose, users = [] }) => {
  const [open, setOpen] = useState(false);
  const [tglAbsen, setTglAbsen] = useState<Date | undefined>(absensi?.tanggal ? new Date(absensi?.tanggal) : undefined);
  const [tglAbsenOpen, setTglAbsenOpen] = useState(false);

  const { data, setData, put, post, reset, processing } = useForm({
    user_id: purpose === 'create' || purpose === 'duplicate' ? '' : (absensi?.user?.id?.toString() ?? ''),
    tanggal: absensi?.tanggal ?? '',
    jam_masuk: absensi?.jam_masuk ?? '',
    jam_keluar: absensi?.jam_keluar ?? '',
    status: absensi?.status ?? 'Hadir',
    keterangan: absensi?.keterangan ?? '',
  });

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      if (!data.user_id) {
        toast.error('Pilih karyawan terlebih dahulu');
        return;
      }
    }
    if (!data.tanggal) {
      toast.error('Tanggal absensi wajib diisi');
      return;
    }
    if (!data.keterangan) {
      toast.error('Keterangan wajib diisi');
      return;
    }
    if (['Hadir', 'Telat'].includes(data.status) && !data.jam_masuk) {
      toast.error('Jam masuk wajib diisi untuk status Hadir/Telat');
      return;
    }

    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('absensi.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Absensi created successfully');
          reset();
          setOpen(false);
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('absensi.update', absensi?.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Absensi updated successfully');
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
          <DialogTitle>{capitalizeWords(purpose)} data absensi</DialogTitle>
          <DialogDescription> {purpose === 'create' ? 'Tambah absensi manual untuk karyawan' : 'Edit data absensi'}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {(purpose === 'create' || purpose === 'duplicate') && users.length > 0 && (
              <FormControl label="Pilih karyawan">
                <Select value={data.user_id} onValueChange={(value: string) => setData('user_id', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih karyawan" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            )}
            {purpose === 'edit' && absensi?.user && (
              <FormControl label="karyawan">
                <Input value={absensi.user.name} disabled />
              </FormControl>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormControl label="Tanggal masuk">
                <Popover open={tglAbsenOpen} onOpenChange={setTglAbsenOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" id="date" className="w-full justify-between font-normal">
                      {tglAbsen ? tglAbsen.toLocaleDateString('id-ID') : 'Pilih tanggal'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tglAbsen}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setTglAbsen(date);
                        setTglAbsenOpen(false);
                        if (date) {
                          // ✅ FIX: Manual format tanpa timezone conversion
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          const formatted = `${year}-${month}-${day}`;

                          console.log('Manual formatted date:', formatted);
                          setData('tanggal', formatted);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>

              <FormControl label="Status kehadiran">
                <Select
                  value={data.status ?? ''}
                  onValueChange={(value: 'Hadir' | 'Telat' | 'Sakit' | 'Izin' | 'Lainnya') => setData('status', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hadir">Hadir</SelectItem>
                    <SelectItem value="Telat">Telat</SelectItem>
                    <SelectItem value="Sakit">Sakit</SelectItem>
                    <SelectItem value="Izin">Izin</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormControl label="Jam masuk" required={['Hadir', 'Telat'].includes(data.status)}>
                <Input
                  type="time"
                  placeholder="Jam masuk"
                  value={data.jam_masuk}
                  onChange={(e) => setData('jam_masuk', e.target.value)}
                  disabled={!['Hadir', 'Telat'].includes(data.status)}
                />
                {!['Hadir', 'Telat'].includes(data.status) && <p className="text-xs text-gray-500">Tidak perlu diisi untuk izin/sakit</p>}
              </FormControl>
              <FormControl label="Jam keluar" required={false}>
                <Input
                  type="time"
                  placeholder="Jam keluar"
                  value={data.jam_keluar}
                  onChange={(e) => setData('jam_keluar', e.target.value)}
                  disabled={!data.jam_masuk}
                />
                {!data.jam_masuk && <p className="text-xs text-gray-500">Isi jam masuk terlebih dahulu</p>}
              </FormControl>
            </div>

            <FormControl label="Keterangan">
              <Textarea
                placeholder="Contoh: Lupa absen, dinas luar, sakit dengan surat dokter, meeting client, dll."
                value={data.keterangan}
                onChange={(e) => setData('keterangan', e.target.value)}
                rows={3}
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
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} absensi`} loading={processing} disabled={processing} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AbsensiFormSheet;
