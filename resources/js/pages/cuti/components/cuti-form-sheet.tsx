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
import { Cuti } from '@/types/cuti';
import { User } from '@/types/user';
import { useForm } from '@inertiajs/react';
import { ChevronDownIcon, X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  cuti?: Cuti;
  purpose: FormPurpose;
  users?: User[];
};

const CutiFormSheet: FC<Props> = ({ children, cuti, purpose, users = [] }) => {
  const [open, setOpen] = useState(false);
  const [tglCuti, setTglCuti] = useState<Date | undefined>(cuti?.tgl_pengajuan ? new Date(cuti?.tgl_pengajuan) : undefined);
  const [tglMulai, setTglMulai] = useState<Date | undefined>(cuti?.tgl_mulai ? new Date(cuti?.tgl_mulai) : undefined);
  const [tglSelesai, setTglSelesai] = useState<Date | undefined>(cuti?.tgl_selesai ? new Date(cuti?.tgl_selesai) : undefined);
  const [tglCutiOpen, setTglCutiOpen] = useState(false);
  const [tglMulaiOpen, setTglMulaiOpen] = useState(false);
  const [tglSelesaiOpen, setTglSelesaiOpen] = useState(false);

  const { data, setData, put, post, reset, processing } = useForm({
    user_id: purpose === 'create' || purpose === 'duplicate' ? '' : (cuti?.user?.id?.toString() ?? ''),
    tgl_pengajuan: cuti?.tgl_pengajuan,
    tgl_mulai: cuti?.tgl_mulai,
    tgl_selesai: cuti?.tgl_selesai,
    jenis_cuti: cuti?.jenis_cuti,
    alasan: cuti?.alasan,
  });

  const handleSubmit = () => {
    if (!data.tgl_mulai) {
      toast.error('Tanggal mulai cuti wajib diisi');
      return;
    }

    if (!data.tgl_selesai) {
      toast.error('Tanggal selesai cuti wajib diisi');
      return;
    }

    if (!data.jenis_cuti) {
      toast.error('Jenis cuti wajib dipilih');
      return;
    }

    if (!data.alasan) {
      toast.error('Alasan cuti wajib diisi');
      return;
    }

    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('cuti.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Cuti created successfully');
          reset();
          setOpen(false);
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('cuti.update', cuti?.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Cuti updated successfully');
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
          <DialogTitle>{capitalizeWords(purpose)} data cuti</DialogTitle>
          <DialogDescription>Form untuk {purpose} data cuti</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {(purpose === 'create' || purpose === 'duplicate') && (
              <FormControl label="Pilih karyawan">
                <Select value={data.user_id} onValueChange={(value: string) => setData('user_id', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih karyawan" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.length > 0 ? (
                      users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        Tidak ada karyawan tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
            )}
            {purpose === 'edit' && cuti?.user && (
              <FormControl label="karyawan">
                <Input value={cuti.user.name} disabled />
              </FormControl>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormControl label="Tanggal masuk">
                <Popover open={tglCutiOpen} onOpenChange={setTglCutiOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" id="date" className="w-full justify-between font-normal">
                      {tglCuti ? tglCuti.toLocaleDateString('id-ID') : 'Pilih tanggal'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tglCuti}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setTglCuti(date);
                        setTglCutiOpen(false);
                        if (date) {
                          // ✅ FIX: Manual format tanpa timezone conversion
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          const formatted = `${year}-${month}-${day}`;

                          console.log('Manual formatted date:', formatted);
                          setData('tgl_pengajuan', formatted);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>

              <FormControl label="Jenis cuti">
                <Select
                  value={data.jenis_cuti ?? ''}
                  onValueChange={(value: 'Cuti Tahunan' | 'Cuti Besar' | 'Cuti Sakit' | 'Cuti Melahirkan' | 'Cuti Lainnya') =>
                    setData('jenis_cuti', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cuti Tahunan">Cuti Tahunan</SelectItem>
                    <SelectItem value="Cuti Besar">Cuti Besar</SelectItem>
                    <SelectItem value="Cuti Sakit">Cuti Sakit</SelectItem>
                    <SelectItem value="Cuti Melahirkan">Cuti Melahirkan</SelectItem>
                    <SelectItem value="Cuti Lainnya">Cuti Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormControl label="Tanggal mulai">
                <Popover open={tglMulaiOpen} onOpenChange={setTglMulaiOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" id="date" className="w-full justify-between font-normal">
                      {tglMulai ? tglMulai.toLocaleDateString('id-ID') : 'Pilih tanggal'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tglMulai}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setTglMulai(date);
                        setTglMulaiOpen(false);
                        if (date) {
                          // ✅ FIX: Manual format tanpa timezone conversion
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          const formatted = `${year}-${month}-${day}`;

                          console.log('Manual formatted date:', formatted);
                          setData('tgl_mulai', formatted);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormControl label="Tanggal selesai">
                <Popover open={tglSelesaiOpen} onOpenChange={setTglSelesaiOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" id="date" className="w-full justify-between font-normal">
                      {tglSelesai ? tglSelesai.toLocaleDateString('id-ID') : 'Pilih tanggal'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tglSelesai}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setTglSelesai(date);
                        setTglSelesaiOpen(false);
                        if (date) {
                          // ✅ FIX: Manual format tanpa timezone conversion
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          const formatted = `${year}-${month}-${day}`;

                          console.log('Manual formatted date:', formatted);
                          setData('tgl_selesai', formatted);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </div>

            <FormControl label="Alasan">
              <Textarea
                placeholder="Contoh: Keluar kota, melahirkan, opname, dll"
                value={data.alasan}
                onChange={(e) => setData('alasan', e.target.value)}
                rows={3}
              />
            </FormControl>
          </form>
        </ScrollArea>
        <DialogFooter>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} cuti`} loading={processing} disabled={processing} />
          <DialogClose asChild>
            <Button variant={'outline'}>
              <X /> Batalin
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CutiFormSheet;
