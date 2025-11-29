// resources/js/pages/dashboard/components/AbsensiCard.tsx
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/ui/status-badge';
import { Textarea } from '@/components/ui/textarea';
import { dateDFY } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { AlertCircle, Calendar as CalendarIcon, CheckCircle, ChevronDown, Clock, MoreHorizontal, Plus, Stethoscope, UserCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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

type Cuti = {
  id: number;
  user_id: number;
  tgl_pengajuan: string;
  tgl_mulai: string;
  tgl_selesai: string;
  jenis_cuti: string;
  alasan: string;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
};

type AbsensiCardProps = {
  absensiHariIni?: Absensi | null;
  cutiHariIni?: Cuti | null;
  pengajuanCutiAktif?: Cuti[];
};

type IzinForm = {
  tanggal: string;
  tipe: 'Sakit' | 'Izin' | 'Lainnya';
  jenis_lainnya: string;
  keterangan: string;
};

type CutiForm = {
  tgl_mulai: string;
  tgl_selesai: string;
  jenis_cuti: 'Cuti Tahunan' | 'Cuti Besar' | 'Cuti Sakit' | 'Cuti Melahirkan' | 'Cuti Lainnya';
  alasan: string;
};

export default function AbsensiCard({
  absensiHariIni: initialAbsensi,
  cutiHariIni: initialCuti,
  pengajuanCutiAktif: initialPengajuan,
}: AbsensiCardProps) {
  const { props } = usePage<AbsensiCardProps>();

  // Local state management
  const [absensi, setAbsensi] = useState<Absensi | null>(initialAbsensi ?? props.absensiHariIni ?? null);
  const [cuti, setCuti] = useState<Cuti | null>(initialCuti ?? props.cutiHariIni ?? null);
  const [pengajuanCutiAktif, setPengajuanCutiAktif] = useState<Cuti[]>(initialPengajuan ?? props.pengajuanCutiAktif ?? []);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCutiOpen, setDialogCutiOpen] = useState(false);
  const [tglMulaiOpen, setTglMulaiOpen] = useState(false);
  const [tglSelesaiOpen, setTglSelesaiOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tglMulai, setTglMulai] = useState<Date | undefined>(undefined);
  const [tglSelesai, setTglSelesai] = useState<Date | undefined>(undefined);
  const [isCutoffTime, setIsCutoffTime] = useState(false);

  const [izinForm, setIzinForm] = useState<IzinForm>({
    tanggal: new Date().toISOString().split('T')[0],
    tipe: 'Izin',
    jenis_lainnya: '',
    keterangan: '',
  });

  const [cutiForm, setCutiForm] = useState<CutiForm>({
    tgl_mulai: '',
    tgl_selesai: '',
    jenis_cuti: 'Cuti Tahunan',
    alasan: '',
  });

  // ===== CUTOFF TIME LOGIC =====
  useEffect(() => {
    const checkCutoff = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Cutoff tombol absen kalo udah lewat jam 17:59
      if (hours >= 17 || (hours === 17 && minutes >= 59)) {
        setIsCutoffTime(true);
      } else {
        setIsCutoffTime(false);
      }
    };

    checkCutoff();
    const interval = setInterval(checkCutoff, 60 * 1000); // Check setiap menit
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isCutoffTime) {
      toast.info('Waktu absensi hari ini sudah berakhir.');
    }
  }, [isCutoffTime]);

  // ===== SYNC PROPS WITH LOCAL STATE =====
  useEffect(() => {
    // sync props -> local state when props change (Inertia navigation)
    setAbsensi(initialAbsensi ?? props.absensiHariIni ?? null);
    setCuti(initialCuti ?? props.cutiHariIni ?? null);
    setPengajuanCutiAktif(initialPengajuan ?? props.pengajuanCutiAktif ?? []);
  }, [initialAbsensi, initialCuti, initialPengajuan, props.absensiHariIni, props.cutiHariIni, props.pengajuanCutiAktif]);

  const formattedDate = (date: Date): string => {
    const adjustedDate = new Date(date.getTime() + 8 * 60 * 60 * 1000); // UTC+8
    return adjustedDate.toISOString().split('T')[0];
  };

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // ===== DERIVED STATE VARIABLES =====
  // Flag untuk menandai user sedang dalam periode cuti yang disetujui
  const isInApprovedCutiPeriod = useMemo(() => {
    if (!cuti) return false;

    // Normalize status agar gak case-sensitive
    const status = (cuti.approval_status || '').toLowerCase();
    if (status !== 'approved') return false;

    // Convert date objects
    const today = new Date(todayStr);
    const mulai = new Date(cuti.tgl_mulai);
    const selesai = new Date(cuti.tgl_selesai);

    return today >= mulai && today <= selesai;
  }, [cuti, todayStr]);

  // Flag untuk status absensi hari ini
  const hasCheckedInToday = useMemo(() => !!absensi, [absensi]);
  const hasCheckedOutToday = useMemo(() => !!absensi && !!absensi.jam_keluar, [absensi]);
  const isIzinSakitLainnya = useMemo(
    () => hasCheckedInToday && ['Sakit', 'Izin', 'Lainnya'].includes(absensi?.status || ''),
    [absensi, hasCheckedInToday],
  );
  const isHadirTelat = useMemo(() => hasCheckedInToday && ['Hadir', 'Telat'].includes(absensi?.status || ''), [absensi, hasCheckedInToday]);

  // Flag untuk pengajuan cuti
  const hasAnyCutiPengajuan = useMemo(() => pengajuanCutiAktif.length > 0, [pengajuanCutiAktif]);
  const hasPendingCuti = useMemo(() => pengajuanCutiAktif.some((cuti) => cuti.approval_status === 'Pending'), [pengajuanCutiAktif]);

  // ===== BUTTON CONFIGURATION LOGIC =====
  const computeButtonConfig = () => {
    // Prioritas 1: User sedang dalam masa cuti approved
    if (isInApprovedCutiPeriod) {
      return {
        text: `Sedang Cuti (${cuti?.jenis_cuti})`,
        icon: <CheckCircle />,
        variant: 'secondary' as const,
        disabled: true,
      };
    }

    // Prioritas 2: User sudah mengajukan izin/sakit/lainnya
    if (isIzinSakitLainnya) {
      return {
        text: `Sudah Ajukan ${absensi?.status}`,
        icon: <CheckCircle />,
        variant: 'secondary' as const,
        disabled: true,
      };
    }

    // Prioritas 3: Flow absensi normal
    if (!hasCheckedInToday) {
      return {
        text: 'Check In',
        icon: <Clock />,
        variant: 'default' as const,
        disabled: false,
      };
    }
    if (hasCheckedInToday && !hasCheckedOutToday) {
      return {
        text: 'Check Out',
        icon: <CheckCircle />,
        variant: 'outline' as const,
        disabled: false,
      };
    }

    // Default: Absensi sudah lengkap
    return {
      text: 'Absensi Lengkap',
      icon: <CheckCircle />,
      variant: 'secondary' as const,
      disabled: true,
    };
  };

  const buttonConfig = computeButtonConfig();

  // ===== RENDER CONDITIONS =====
  // Kondisi utama yang menentukan konten yang ditampilkan
  const showCutiBanner = isInApprovedCutiPeriod;
  const showBelumCheckinMessage = !hasCheckedInToday && !showCutiBanner;
  const showIzinSakitMessage = isIzinSakitLainnya;
  const showAbsensiDetail = isHadirTelat;
  const showMainActionButton = !showCutiBanner && !isIzinSakitLainnya;
  const showSeparator = showMainActionButton;

  // Helper functions
  const getNowTime = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  // === Handlers (tetap sama seperti sebelumnya) ===
  const handleAbsensi = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const originalAbsensi = absensi;

    try {
      if (!absensi) {
        // Check-in optimistic update
        const optimistic: Absensi = {
          id: -Date.now(),
          user_id: 0,
          tanggal: todayStr,
          jam_masuk: getNowTime(),
          jam_keluar: null,
          status: 'Hadir',
          approval_status: 'Pending',
          keterangan: undefined,
        };
        setAbsensi(optimistic);

        await router.post(
          route('absensi.handle'),
          {},
          {
            preserveScroll: true,
            onSuccess: () => {
              toast.success('Check-in berhasil!');
            },
            onError: () => {
              toast.error('Gagal check-in');
              setAbsensi(originalAbsensi);
            },
          },
        );
      } else if (absensi && !absensi.jam_keluar) {
        // Checkout optimistic update
        const updated = { ...absensi, jam_keluar: getNowTime() };
        setAbsensi(updated);

        await router.post(
          route('absensi.handle'),
          {},
          {
            preserveScroll: true,
            onSuccess: () => {
              toast.success('Check-out berhasil!');
            },
            onError: () => {
              toast.error('Gagal check-out');
              setAbsensi(originalAbsensi);
            },
          },
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan jaringan');
      setAbsensi(originalAbsensi);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAjukanIzin = async () => {
    if (!selectedDate) {
      toast.error('Pilih tanggal terlebih dahulu');
      return;
    }

    if (izinForm.tipe === 'Lainnya' && !izinForm.jenis_lainnya.trim()) {
      toast.error('Isi jenis izin untuk opsi Lainnya');
      return;
    }

    if (!izinForm.keterangan.trim()) {
      toast.error('Alasan detail wajib diisi');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('tanggal', formattedDate(selectedDate));
    formData.append('tipe', izinForm.tipe);
    formData.append('keterangan', izinForm.keterangan || '');
    if (izinForm.tipe === 'Lainnya') formData.append('jenis_lainnya', izinForm.jenis_lainnya);

    try {
      // optimistic: mark absensi as izin locally
      const optimisticIzin: Absensi = {
        id: -Date.now(),
        user_id: 0,
        tanggal: formattedDate(selectedDate),
        jam_masuk: '',
        jam_keluar: null,
        status: izinForm.tipe,
        approval_status: 'Pending',
        keterangan: izinForm.keterangan,
      };
      setAbsensi(optimisticIzin);

      await router.post(route('absensi.ajukan-izin'), formData, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Izin diajukan');
          setDialogOpen(false);
          // reset form
          setSelectedDate(new Date());
          setIzinForm({
            tanggal: formattedDate(new Date()),
            tipe: 'Izin',
            jenis_lainnya: '',
            keterangan: '',
          });
        },
        onError: () => {
          toast.error('Gagal mengajukan izin');
          setAbsensi(null);
        },
        onFinish: () => setIsLoading(false),
      });
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan');
      setIsLoading(false);
    }
  };

  const handleAjukanCuti = async () => {
    if (!cutiForm.tgl_mulai || !cutiForm.tgl_selesai) {
      toast.error('Tanggal mulai dan selesai harus diisi');
      return;
    }

    if (new Date(cutiForm.tgl_mulai) > new Date(cutiForm.tgl_selesai)) {
      toast.error('Tanggal selesai harus setelah tanggal mulai');
      return;
    }

    if (!cutiForm.alasan.trim()) {
      toast.error('Alasan wajib diisi');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('tgl_mulai', cutiForm.tgl_mulai);
    formData.append('tgl_selesai', cutiForm.tgl_selesai);
    formData.append('jenis_cuti', cutiForm.jenis_cuti);
    formData.append('alasan', cutiForm.alasan);

    try {
      // optimistic: add pengajuan locally
      const optimisticCuti: Cuti = {
        id: -Date.now(),
        user_id: 0,
        tgl_pengajuan: todayStr,
        tgl_mulai: cutiForm.tgl_mulai,
        tgl_selesai: cutiForm.tgl_selesai,
        jenis_cuti: cutiForm.jenis_cuti,
        alasan: cutiForm.alasan,
        approval_status: 'Pending',
      };
      setPengajuanCutiAktif((prev) => [optimisticCuti, ...prev]);

      await router.post(route('cuti.ajukan-cuti'), formData, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Cuti Berhasil diajukan! Silahkan lakukan absensi normal selagi menunggu persetujuan!');
          setDialogCutiOpen(false);
          setCutiForm({
            tgl_mulai: '',
            tgl_selesai: '',
            jenis_cuti: 'Cuti Tahunan',
            alasan: '',
          });
          setTglMulai(undefined);
          setTglSelesai(undefined);
        },
        onError: () => {
          toast.error('Gagal mengajukan cuti');
          setPengajuanCutiAktif((prev) => prev.filter((c) => c.id !== optimisticCuti.id));
        },
        onFinish: () => setIsLoading(false),
      });
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengajukan cuti');
      setIsLoading(false);
    }
  };

  const handleLihatDetailCuti = () => {
    router.get(route('cuti.index'));
  };

  // ===== RENDER COMPONENT =====
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Absensi Hari Ini
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* === BANNER CUTI (Highest Priority) === */}
        {showCutiBanner && (
          <div className="py-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-amber-500" />
            <CardDescription>
              <p className="mb-2 text-lg font-medium text-gray-700">Anda sedang dalam masa cuti</p>
              <p className="mb-4 text-sm text-gray-500">Anda tidak dapat melakukan absensi normal ketika sedang dalam masa cuti.</p>
            </CardDescription>
            <CardDescription>
              <p>Periode cuti:</p>
              {cuti?.tgl_mulai} - {cuti?.tgl_selesai}
            </CardDescription>
          </div>
        )}

        {/* === PESAN BELUM CHECKIN === */}
        {showBelumCheckinMessage && (
          <div className="py-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-amber-500" />
            <CardDescription>
              <p className="mb-2 text-lg font-medium text-gray-700">Anda belum melakukan absensi hari ini</p>
              <p className="mb-4 text-sm text-gray-500">Silakan lakukan check-in absensi atau ajukan izin jika tidak hadir.</p>
            </CardDescription>
          </div>
        )}

        {/* === STATUS IZIN/SAKIT/LAINNYA === */}
        {showIzinSakitMessage && absensi && (
          <div className="py-6 text-center">
            <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-500" />
            <CardDescription>
              <p className="mb-2 text-lg font-medium text-gray-400">Anda sudah mengajukan {absensi.status}</p>
              <p className="mb-2 text-sm text-gray-200">{dateDFY(absensi.tanggal)}</p>
              {absensi.keterangan && (
                <div className="mt-2">
                  <p className="text-sm text-gray-400">Alasan:</p>
                  <p className="text-sm text-gray-200">{absensi.keterangan}</p>
                </div>
              )}
              <p className="mt-3 text-sm">
                <StatusBadge status={absensi.approval_status} />
              </p>
            </CardDescription>
          </div>
        )}

        {/* === DETAIL ABSENSI NORMAL (HADIR/TELAT) === */}
        {showAbsensiDetail && absensi && (
          <div className="space-y-4">
            <div className="rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-sm font-medium text-gray-600">Tanggal</p>
                  <p className="text-lg font-semibold">{dateDFY(absensi.tanggal)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <StatusBadge status={absensi.status || 'N/A'} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Approval</p>
                  <StatusBadge status={absensi.approval_status} />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Jam Masuk</p>
                  <p className="text-lg font-semibold text-green-600">{absensi.jam_masuk || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Jam Keluar</p>
                  <p className={`text-lg font-semibold ${absensi.jam_keluar ? 'text-red-600' : 'text-gray-400'}`}>
                    {absensi.jam_keluar || 'Belum check-out'}
                  </p>
                </div>
                {absensi.keterangan && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-600">Keterangan</p>
                    <p className="text-sm">{absensi.keterangan}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === ACTION BUTTONS SECTION === */}
        <div className="grid w-full grid-rows-1 gap-2">
          {/* Main Action Button (Check In/Out) */}
          {showMainActionButton && (
            <Button
              onClick={handleAbsensi}
              disabled={buttonConfig.disabled || isLoading || isCutoffTime}
              variant={buttonConfig.variant}
              size="lg"
              className="w-full"
            >
              {buttonConfig.icon}
              {isCutoffTime ? 'Waktu absensi telah berakhir' : isLoading ? 'Memproses...' : buttonConfig.text}
            </Button>
          )}

          {/* Separator hanya ditampilkan jika main button aktif */}
          {showSeparator && <Separator />}

          {/* Secondary Action Buttons */}
          <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
            {/* AJUKAN IZIN BUTTON */}
            {!showCutiBanner && (
              <div className="order-first w-full">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" size="lg" disabled={isLoading || hasCheckedInToday || isCutoffTime}>
                      <Plus className="mr-2 h-4 w-4" />
                      {isCutoffTime
                        ? 'Waktu absensi telah berakhir'
                        : isIzinSakitLainnya
                          ? 'Anda telah mengajukan izin'
                          : 'Ajukan Izin, Sakit atau lainnya'}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Form Pengajuan Izin</DialogTitle>
                      <DialogDescription>form pengisian izin kerja</DialogDescription>
                    </DialogHeader>

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

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Tanggal</Label>
                        <div className="col-span-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-between font-normal">
                                {selectedDate?.toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                  if (date) {
                                    setSelectedDate(date);
                                    setIzinForm({ ...izinForm, tanggal: formattedDate(date) });
                                  }
                                }}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="keterangan" className="text-right">
                          Alasan Detail
                        </Label>
                        <Textarea
                          id="keterangan"
                          value={izinForm.keterangan}
                          onChange={(e) => setIzinForm({ ...izinForm, keterangan: e.target.value })}
                          placeholder={
                            izinForm.tipe === 'Lainnya' ? 'Jelaskan detail alasan izin secara lengkap...' : 'Jelaskan alasan izin/sakit...'
                          }
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
            )}

            {/* CUTI BUTTONS SECTION */}
            {!showCutiBanner && (
              <div className="order-last flex w-full gap-2">
                {/* TOMBOL LIHAT DETAIL CUTI (jika ada riwayat) */}
                {hasAnyCutiPengajuan && (
                  <Button variant="outline" className="relative flex-1" size="lg" onClick={handleLihatDetailCuti}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Lihat Cuti
                    {hasPendingCuti && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                        {pengajuanCutiAktif.filter((c) => c.approval_status === 'Pending').length}
                      </span>
                    )}
                  </Button>
                )}

                {/* TOMBOL AJUKAN CUTI BARU (selalu tersedia) */}
                <Dialog open={dialogCutiOpen} onOpenChange={setDialogCutiOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className={hasAnyCutiPengajuan ? 'flex-1' : 'w-full'} size="lg" disabled={isLoading}>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajukan Cuti
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Form pengajuan cuti</DialogTitle>
                      <DialogDescription>Ajukan cuti untuk periode tertentu</DialogDescription>
                    </DialogHeader>

                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="w-full">
                        <Label className="text-right">Tanggal Pengajuan</Label>
                        <Button variant="outline" className="w-full justify-between font-normal" disabled>
                          {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <Label className="text-right">Jenis Cuti</Label>
                        <Select
                          value={cutiForm.jenis_cuti}
                          onValueChange={(value) =>
                            setCutiForm({
                              ...cutiForm,
                              jenis_cuti: value as CutiForm['jenis_cuti'],
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih jenis cuti" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cuti Tahunan">Cuti Tahunan</SelectItem>
                            <SelectItem value="Cuti Besar">Cuti Besar</SelectItem>
                            <SelectItem value="Cuti Sakit">Cuti Sakit</SelectItem>
                            <SelectItem value="Cuti Melahirkan">Cuti Melahirkan</SelectItem>
                            <SelectItem value="Cuti Lainnya">Cuti Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-right">Tanggal Mulai</Label>
                        <Popover open={tglMulaiOpen} onOpenChange={setTglMulaiOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between font-normal">
                              {tglMulai ? tglMulai.toLocaleDateString('id-ID') : 'Pilih tanggal'}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={tglMulai}
                              onSelect={(date) => {
                                setTglMulai(date);
                                setTglMulaiOpen(false);
                                if (date) {
                                  setCutiForm({ ...cutiForm, tgl_mulai: formattedDate(date) });
                                }
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label className="text-right">Tanggal Selesai</Label>
                        <Popover open={tglSelesaiOpen} onOpenChange={setTglSelesaiOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between font-normal">
                              {tglSelesai ? tglSelesai.toLocaleDateString('id-ID') : 'Pilih tanggal'}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={tglSelesai}
                              onSelect={(date) => {
                                setTglSelesai(date);
                                setTglSelesaiOpen(false);
                                if (date) {
                                  setCutiForm({ ...cutiForm, tgl_selesai: formattedDate(date) });
                                }
                              }}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="w-full">
                      <Label htmlFor="alasan" className="text-right">
                        Alasan Detail
                      </Label>
                      <Textarea
                        id="alasan"
                        value={cutiForm.alasan}
                        onChange={(e) => setCutiForm({ ...cutiForm, alasan: e.target.value })}
                        placeholder="Jelaskan secara singkat keperluan cuti anda"
                        className="w-full"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setDialogCutiOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleAjukanCuti} disabled={isLoading}>
                        {isLoading ? 'Mengirim...' : 'Ajukan Cuti'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
