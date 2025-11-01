import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { capitalizeWords, em, formatPeriodeLabel, formatRupiah } from '@/lib/utils';
import { FormPurpose } from '@/types';
import { Payroll } from '@/types/payroll';
import { User } from '@/types/user';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  payroll?: Payroll;
  purpose: FormPurpose;
  users: User[];
};

const PayrollFormSheet: FC<Props> = ({ children, payroll, purpose, users }) => {
  const [open, setOpen] = useState(false);
  const [availablePeriodes, setAvailablePeriodes] = useState<string[]>([]);
  const [absensiSummary, setAbsensiSummary] = useState<any>(null);

  const { data, setData, put, post, reset, processing } = useForm({
    user_id: purpose === 'create' || purpose === 'duplicate' ? '' : (payroll?.user?.id.toString() ?? ''),
    periode: payroll?.periode ?? '',
    gaji_pokok: payroll?.gaji_pokok ?? '',
    tunjangan: payroll?.tunjangan ?? '',
    potongan: payroll?.potongan ?? '',
    total_gaji: payroll?.total_gaji ?? '',
    tanggal: new Date().toISOString().split('T')[0],
  });

  const handlePilihKaryawan = async (userId: string) => {
    console.log('User ID yang dikirim:', userId);
    console.log('Route URL:', route('payroll.availablePeriodes', { user: userId }));
    // Di dalam component, cek initial state
    console.log('Initial user_id:', purpose === 'create' || purpose === 'duplicate' ? ' ' : (payroll?.user?.id.toString() ?? ''));
    setData((prev) => ({
      ...prev,
      user_id: userId,
      // Reset form
      periode: '',
      gaji_pokok: '',
      tunjangan: '',
      potongan: '',
      total_gaji: '',
    }));

    try {
      const res = await fetch(route('payroll.availablePeriodes', { user: userId }));
      const periodes = await res.json();
      setAvailablePeriodes(periodes);
    } catch (e) {
      console.error('Gagal fetch periode:', e);
      setAvailablePeriodes([]);
    }
  };

  const handlePilihPeriode = async (periode: string) => {
    console.log('periode yang dipilihh:', periode);

    setData('periode', periode);

    if (!data.user_id || !periode) return;

    console.log('routenya ke:', route('payroll.absensiSummary', { user: data.user_id, periode }));

    try {
      const res = await fetch(route('payroll.absensiSummary', { user: data.user_id, periode }));

      if (!res.ok) throw new Error('Gagal ambil data summary');

      const summary = await res.json();
      console.log(summary);
      setAbsensiSummary(summary);

      // auto-set data dari summary
      setData((prev) => ({
        ...prev,
        gaji_pokok: summary.gaji_pokok?.toString() ?? '',
        tunjangan: summary.tunjangan?.toString() ?? '',
        potongan: summary.potongan?.toString() ?? '',
        total_gaji: summary.total_gaji?.toString() ?? '',
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = () => {
    console.log('=== DATA YANG AKAN DIKIRIM ===');
    console.log('Data:', data);
    console.log('User ID:', data.user_id);
    console.log('Periode:', data.periode);

    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('payroll.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Payroll created successfully');
          reset();
          setOpen(false);
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('payroll.update', payroll?.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Payroll updated successfully');
          setOpen(false);
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

  console.log('availablePeriodes:', availablePeriodes);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <ScrollArea className={!absensiSummary ? '' : 'h-[34rem] w-full rounded-md'}>
          <DialogHeader>
            <DialogTitle>{capitalizeWords(purpose)} data payroll</DialogTitle>
            <DialogDescription>Form untuk {purpose} data payroll</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {(purpose === 'create' || purpose === 'duplicate') && users?.length > 0 && (
              <FormControl label="Pilih karyawan" className="mt-2">
                <Select value={data.user_id} onValueChange={handlePilihKaryawan}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Karyawan" />
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
            {purpose === 'edit' && payroll?.user && (
              <FormControl>
                <Input value={payroll.user.name} disabled />
              </FormControl>
            )}
            <FormControl label="Periode">
              <Select value={data.periode} onValueChange={(value) => handlePilihPeriode(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  {availablePeriodes.length > 0 ? (
                    availablePeriodes.map((periode) => (
                      // <SelectItem key={periode} value={periode}>
                      //   {new Date(`${periode}-01`).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                      // </SelectItem>
                      <SelectItem key={periode} value={periode}>
                        {formatPeriodeLabel(periode)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="placeholder" disabled>
                      {!data.user_id ? 'Belum memiliki data absensi ' : 'Pilih karyawan terlebih dahulu'}
                    </SelectItem>
                  )}
                </SelectContent>
                {absensiSummary && (
                  <Card className="mt-4">
                    <CardContent>
                      <CardTitle className="mb-2 text-xl">Rekapan Absensi</CardTitle>
                      <Separator />
                      <div className="mt-4 grid grid-cols-2 space-y-2">
                        <div>
                          <CardDescription>Hadir: {absensiSummary.hadir}</CardDescription>
                          <CardDescription>Telat: {absensiSummary.telat}</CardDescription>
                          <CardDescription>Alpha: {absensiSummary.alpha}</CardDescription>
                        </div>
                        <div>
                          <CardDescription>Izin: {absensiSummary.izin}</CardDescription>
                          <CardDescription>Cuti: {absensiSummary.cuti}</CardDescription>
                        </div>
                      </div>

                      {/* Total Gaji */}
                      <div className="space-y-4">
                        <FormControl className="w-full">
                          <Label>Gaji Pokok</Label>
                          <Input
                            type="text"
                            value={formatRupiah(data.gaji_pokok)}
                            onChange={(e) => handleCurrencyChange('gaji_pokok', e.target.value)}
                            disabled
                          />
                        </FormControl>
                        <div className="grid w-full grid-cols-2 gap-2">
                          <div className="">
                            <FormControl className="w-full">
                              <Label>Tunjangan</Label>
                              <Input
                                className="w-full"
                                type="text"
                                value={formatRupiah(data.tunjangan)}
                                onChange={(e) => handleCurrencyChange('tunjangan', e.target.value)}
                                disabled
                              />
                            </FormControl>
                          </div>
                          <div>
                            <FormControl className="w-full">
                              <Label>Potongan</Label>
                              <Input
                                type="text"
                                value={formatRupiah(data.potongan)}
                                onChange={(e) => handleCurrencyChange('potongan', e.target.value)}
                                disabled
                              />
                            </FormControl>
                          </div>
                        </div>

                        <FormControl className="w-full">
                          <Label>Total Gaji</Label>
                          <Input
                            type="text"
                            value={formatRupiah(data.total_gaji)}
                            onChange={(e) => handleCurrencyChange('total_gaji', e.target.value)}
                            disabled
                          />
                        </FormControl>
                        <FormControl className="w-full">
                          <Label>Tanggal Pengajuan</Label>
                          <Input type="date" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} disabled />
                        </FormControl>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Select>
            </FormControl>
          </form>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>
              <X /> Batal
            </Button>
          </DialogClose>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} payroll`} loading={processing} disabled={processing} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayrollFormSheet;
