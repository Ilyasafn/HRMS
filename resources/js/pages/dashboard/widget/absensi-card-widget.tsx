// resources/js/pages/dashboard/components/AbsensiCard.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/status-badge';
import { dateDFY } from '@/lib/utils';
import { router } from '@inertiajs/react';

import { AlertCircle, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

// Type definition untuk absensi data
type Absensi = {
  id: number;
  user_id: number;
  tanggal: string;
  jam_masuk: string;
  jam_keluar?: string | null;
  approval_status: 'Pending' | 'Approved' | 'Rejected';
  status: 'Hadir' | 'Telat' | 'Sakit' | 'Izin' | 'Cuti' | 'Alpha';
};

type AbsensiCardProps = {
  absensiHariIni?: Absensi | null;
};

export default function AbsensiCard({ absensiHariIni }: AbsensiCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Function untuk handle submit check-in/check-out
  const handleAbsensi = async () => {
    setIsLoading(true);

    // Submit ke route yang sudah kamu buat
    router.post(
      route('absensi.handle'),
      {},
      {
        onFinish: () => setIsLoading(false),
        onError: (errors) => {
          console.error('Absensi gagal:', errors);
          setIsLoading(false);
        },
      },
    );
  };

  // Function untuk determine status saat ini
  const getCurrentStatus = () => {
    if (!absensiHariIni) {
      return 'belum-checkin';
    } else if (absensiHariIni && !absensiHariIni.jam_keluar) {
      return 'sudah-checkin';
    } else {
      return 'completed';
    }
  };

  // Function untuk get appropriate button text dan style
  const getButtonConfig = () => {
    const status = getCurrentStatus();

    switch (status) {
      case 'belum-checkin':
        return {
          text: 'Check In',
          icon: <Clock className="mr-2 h-4 w-4" />,
          variant: 'default' as const,
          disabled: false,
        };
      case 'sudah-checkin':
        return {
          text: 'Check Out',
          icon: <CheckCircle className="mr-2 h-4 w-4" />,
          variant: 'destructive' as const,
          disabled: false,
        };
      case 'completed':
        return {
          text: 'Absensi Lengkap',
          icon: <CheckCircle className="mr-2 h-4 w-4" />,
          variant: 'secondary' as const,
          disabled: true,
        };
    }
  };

  const status = getCurrentStatus();
  const buttonConfig = getButtonConfig();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Absensi Hari Ini
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Conditional rendering berdasarkan status */}
        {status === 'belum-checkin' ? (
          /* UI untuk user yang belum check-in */
          <div className="py-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-12 w-12 text-amber-500" />
            <p className="mb-2 text-lg font-medium text-gray-700">Anda belum check-in hari ini</p>
            <p className="mb-4 text-sm text-gray-500">Silakan lakukan check-in untuk memulai absensi hari ini</p>
          </div>
        ) : (
          /* UI untuk user yang sudah check-in */
          <div className="space-y-4">
            <div className="rounded-lg p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-center">
                {/* Informasi Tanggal */}
                <div className="">
                  <p className="text-sm font-medium text-gray-600">Tanggal</p>
                  <p className="text-lg font-semibold">{dateDFY(absensiHariIni!.tanggal)}</p>
                </div>
                {/* Status Kehadiran */}
                <div className="">
                  <p className="text-sm font-medium text-gray-600">Status Kehadiran</p>
                  <StatusBadge status={absensiHariIni?.status || 'N/A'} />
                </div>
                {/* Status Approval */}
                <div className="">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <StatusBadge status={absensiHariIni!.approval_status} />
                </div>
                {/* Jam Masuk */}
                <div className="col-start-1 md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Jam Masuk</p>
                  <p className="text-lg font-semibold text-green-600">{absensiHariIni!.jam_masuk}</p>
                </div>
                {/* Jam Keluar */}
                <div className="">
                  <p className="text-sm font-medium text-gray-600">Jam Keluar</p>
                  <p className={`text-lg font-semibold ${absensiHariIni!.jam_keluar ? 'text-red-600' : 'text-gray-400'}`}>
                    {absensiHariIni!.jam_keluar ? absensiHariIni!.jam_keluar : 'Belum check-out'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button - selalu ada di bawah */}
        <div className="pt-2">
          <Button onClick={handleAbsensi} disabled={buttonConfig.disabled || isLoading} variant={buttonConfig.variant} size="lg" className="w-full">
            {buttonConfig.icon}
            {isLoading ? 'Memproses...' : buttonConfig.text}
          </Button>
        </div>

        {/* Informational text untuk completed state */}
        {status === 'completed' && <p className="text-center text-sm text-gray-500">Terima kasih, absensi Anda hari ini sudah lengkap!</p>}
      </CardContent>
    </Card>
  );
}
