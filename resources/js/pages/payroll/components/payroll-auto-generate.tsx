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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPeriodeLabel } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren;

const PayrollAutoGenerateAll: FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availablePeriodes, setAvailablePeriodes] = useState<string[]>([]);

  const { data, setData, post, processing } = useForm({
    periode: '',
  });

  // 🔄 Fetch semua periode absensi yang tersedia
  const fetchAvailablePeriodes = async () => {
    try {
      const res = await fetch(route('payroll.availablePeriodesAll'), {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Gagal ambil daftar periode');

      const json = await res.json();
      // handle format response baru
      const periodes = json?.periodes ?? [];
      setAvailablePeriodes(periodes);
    } catch (err) {
      console.error('Error fetch available periodes:', err);
      toast.error('Gagal mengambil periode absensi');
      setAvailablePeriodes([]);
    }
  };

  const handleGenerate = async () => {
    if (!data.periode) {
      toast.error('Pilih periode terlebih dahulu!');
      return;
    }

    setLoading(true);

    post(route('payroll.autoGenerate'), {
      preserveScroll: true,
      onSuccess: () => {
        const periodeLabel = format(parse(data.periode, 'yyyy-MM', new Date()), 'MMMM yyyy', { locale: id });
        toast.success(`Payroll ${periodeLabel} berhasil digenerate`);
        setOpen(false);
      },
      onError: (e) => {
        console.error('Error generate payroll:', e);
        toast.error('Gagal generate payroll!');
      },
      onFinish: () => setLoading(false),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        if (state) fetchAvailablePeriodes();
      }}
    >
      <DialogTrigger asChild>{children || <Button>Auto Generate Payroll</Button>}</DialogTrigger>

      <DialogContent>
        <ScrollArea className="max-h-[26rem]">
          <DialogHeader>
            <DialogTitle>Generate Payroll Otomatis</DialogTitle>
            <DialogDescription>
              Fitur ini akan otomatis membuat data payroll untuk semua karyawan berdasarkan absensi pada periode yang dipilih.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4 p-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
          >
            <FormControl label="Pilih Periode Absensi">
              <Select value={data.periode} onValueChange={(v) => setData('periode', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih periode..." />
                </SelectTrigger>
                <SelectContent>
                  {availablePeriodes.length > 0 ? (
                    availablePeriodes.map((periode) => (
                      <SelectItem key={periode} value={periode}>
                        {formatPeriodeLabel(periode)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="placeholder" disabled>
                      Tidak ada periode tersedia
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FormControl>
          </form>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" /> Batal
            </Button>
          </DialogClose>

          <SubmitButton onClick={handleGenerate} label="Generate Semua Payroll" loading={loading || processing} disabled={loading || processing} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayrollAutoGenerateAll;
