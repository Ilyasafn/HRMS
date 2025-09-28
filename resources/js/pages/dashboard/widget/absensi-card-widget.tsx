// resources/js/pages/dashboard/components/AbsensiCard.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/ui/status-badge';
import { Textarea } from '@/components/ui/textarea';
import { dateDFY } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { AlertCircle, Calendar as CalendarIcon, CheckCircle, Clock, MoreHorizontal, Plus, Stethoscope, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Absensi = {
  id: number;
  user_id: number;
  tanggal: string;
  jam_masuk: string;
  jam_keluar?: string | null;
  status: 'Hadir' | 'Telat' | 'Sakit' | 'Izin' | 'Cuti' | 'Alpha' | 'Lainnya';
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  keterangan?: string;
};

type AbsensiCardProps = {
  absensiHariIni?: Absensi | null;
};

type IzinForm = {
  tanggal: string;
  tipe: 'Sakit' | 'Izin' | 'Lainnya';
  jenis_lainnya: string;
  keterangan: string;
};

export default function AbsensiCard({ absensiHariIni }: AbsensiCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [izinForm, setIzinForm] = useState<IzinForm>({
    tanggal: new Date().toISOString().split('T')[0],
    tipe: 'Izin',
    jenis_lainnya: '',
    keterangan: '',
  });

  // Handle date selection

  // Handle absensi check-in/out
  const handleAbsensi = async () => {
    setIsLoading(true);
    router.post(
      route('absensi.handle'),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {},
        onFinish: () => setIsLoading(false),
      },
    );
  };

  // Handle pengajuan izin
  const handleAjukanIzin = async () => {
    if (!selectedDate) {
      toast.error('Pilih tanggal terlebih dahulu');
      return;
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    console.log('Tanggal dikirim:', formattedDate); // Debug

    if (izinForm.tipe === 'Lainnya' && !izinForm.jenis_lainnya.trim()) {
      alert('Harap isi jenis izin untuk opsi Lainnya');
      return;
    }

    if (!izinForm.tanggal) {
      alert('Harap pilih tanggal izin');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('tanggal', izinForm.tanggal);
    formData.append('tipe', izinForm.tipe);
    formData.append('keterangan', izinForm.keterangan);

    if (izinForm.tipe === 'Lainnya') {
      formData.append('jenis_lainnya', izinForm.jenis_lainnya);
    }

    router.post(route('absensi.ajukan-izin'), formData, {
      // ✅ FIX: Tambah onSuccess untuk refresh dan reset form
      preserveScroll: true,
      onSuccess: () => {
        setDialogOpen(false);
        // Reset form
        const today = new Date();
        setSelectedDate(today);
        setIzinForm({
          tanggal: formattedDate,
          tipe: 'Izin',
          jenis_lainnya: '',
          keterangan: '',
        });
      },
      onError: (errors) => {
        console.error('Error submitting izin:', errors);
        alert('Gagal mengajukan izin: ' + JSON.stringify(errors));
      },
      onFinish: () => {
        setIsLoading(false);
      },
    });
  };

  const getCurrentStatus = () => {
    if (!absensiHariIni) return 'belum-checkin';
    if (absensiHariIni?.status && ['Sakit', 'Izin', 'Lainnya'].includes(absensiHariIni?.status)) {
      return 'izin';
    }
    if (absensiHariIni && !absensiHariIni.jam_keluar) return 'sudah-checkin';
    return 'completed';
  };

  const status = getCurrentStatus();
  const buttonConfig = {
    izin: { text: `Sudah izin (${absensiHariIni?.status})`, icon: <CheckCircle />, variant: 'secondary' as const, disabled: true },
    'belum-checkin': { text: 'Check In', icon: <Clock />, variant: 'default' as const, disabled: false },
    'sudah-checkin': { text: 'Check Out', icon: <CheckCircle />, variant: 'outline' as const, disabled: false },
    completed: {
      text: 'Absensi Lengkap',
      icon: <CheckCircle />,
      variant: 'secondary' as const,
      disabled: true,
    },
  }[status];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Absensi Hari Ini
        </CardTitle>
      </CardHeader>

      {/* Card Absensi */}
      <CardContent className="space-y-4">
        {status === 'belum-checkin' ? (
          <div className="py-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-12 w-12 text-amber-500" />
            <CardDescription>
              <p className="mb-2 text-lg font-medium text-gray-700">Anda belum melakukan absensi hari ini</p>
              <p className="mb-4 text-sm text-gray-500">Silakan lakukan check-in absensi atau ajukan izin jika tidak hadir</p>
            </CardDescription>
          </div>
        ) : absensiHariIni?.status && ['Sakit', 'Izin', 'Lainnya'].includes(absensiHariIni?.status) ? (
          <div>
            <div className="py-6 text-center">
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
              <CardDescription>
                <p className="mb-2 text-lg font-medium text-gray-400">Anda sudah mengajukan {absensiHariIni?.status}</p>
                <p className="mb-2 text-sm text-gray-200">{dateDFY(absensiHariIni?.tanggal || '')}</p>
                {absensiHariIni?.keterangan && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Alasan:</p>
                    <p className="text-sm text-gray-200">{absensiHariIni.keterangan}</p>
                  </div>
                )}
                <p className="mt-3 text-sm">
                  <StatusBadge status={absensiHariIni?.approval_status} />
                </p>
              </CardDescription>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-gray-600">Tanggal</p>
                  <p className="text-lg font-semibold">{dateDFY(absensiHariIni!.tanggal)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <StatusBadge status={absensiHariIni?.status || 'N/A'} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Approval</p>
                  <StatusBadge status={absensiHariIni!.approval_status} />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Jam Masuk</p>
                  <p className="text-lg font-semibold text-green-600">{absensiHariIni!.jam_masuk || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Jam Keluar</p>
                  <p className={`text-lg font-semibold ${absensiHariIni!.jam_keluar ? 'text-red-600' : 'text-gray-400'}`}>
                    {absensiHariIni!.jam_keluar || 'Belum check-out'}
                  </p>
                </div>
                <div>
                  {absensiHariIni!.keterangan && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-600">Keterangan</p>
                      <p className="text-sm">{absensiHariIni!.keterangan}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tombol Absensi */}
        <div className="grid w-full grid-rows-1 gap-2">
          <Button onClick={handleAbsensi} disabled={buttonConfig.disabled || isLoading} variant={buttonConfig.variant} size="lg" className="w-full">
            {buttonConfig.icon}
            {isLoading ? 'Memproses...' : buttonConfig.text}
          </Button>

          {/* Separator */}
          <Separator />

          {/* Tombol Ajukan Izin */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" size="lg" disabled={buttonConfig.disabled}>
                <Plus className="mr-2 h-4 w-4" />
                {status === 'izin' ? 'Anda telah mengajukan izin' : 'Ajukan Izin, Sakit atau Lainnya'}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Form Pengajuan Izin</DialogTitle>
                <DialogDescription>form pengisian izin kerja</DialogDescription>
              </DialogHeader>

              {/* Tipe Izin */}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipe" className="text-right">
                    Jenis Izin
                  </Label>
                  <Select
                    value={izinForm.tipe}
                    onValueChange={(value: 'Sakit' | 'Izin' | 'Lainnya') => setIzinForm({ ...izinForm, tipe: value, jenis_lainnya: '' })}
                  >
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sakit">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          Sakit
                        </div>
                      </SelectItem>
                      <SelectItem value="Izin">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Izin
                        </div>
                      </SelectItem>
                      <SelectItem value="Lainnya">
                        <div className="flex items-center gap-2">
                          <MoreHorizontal className="h-4 w-4" />
                          Lainnya
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Field Jenis Lainnya */}
                {izinForm.tipe === 'Lainnya' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="jenis_lainnya" className="text-right">
                      Jenis Izin
                    </Label>
                    <Input
                      id="jenis_lainnya"
                      value={izinForm.jenis_lainnya}
                      onChange={(e) => setIzinForm({ ...izinForm, jenis_lainnya: e.target.value })}
                      placeholder="Contoh: Urusan Keluarga, Acara penting, dll."
                      className="col-span-3"
                    />
                  </div>
                )}

                {/* keterangan tanggal pada hari mengajukan izin */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Tanggal</Label>
                  <div className="col-span-3">
                    <Button variant="outline" className="w-full justify-between font-normal">
                      {selectedDate?.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Button>
                    <Input
                      type="hidden"
                      value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        // Update selectedDate ketika value berubah
                        if (e.target.value) {
                          setSelectedDate(new Date(e.target.value));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Keterangan */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="keterangan" className="text-right">
                    Alasan Detail
                  </Label>
                  <Textarea
                    id="keterangan"
                    value={izinForm.keterangan}
                    onChange={(e) => setIzinForm({ ...izinForm, keterangan: e.target.value })}
                    placeholder={izinForm.tipe === 'Lainnya' ? 'Jelaskan detail alasan izin secara lengkap...' : 'Jelaskan alasan izin/sakit...'}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAjukanIzin} disabled={isLoading}>
                  {isLoading ? 'Mengirim...' : 'Ajukan Izin'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
