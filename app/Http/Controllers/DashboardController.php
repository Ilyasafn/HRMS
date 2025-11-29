<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Cuti;
use App\Models\Payroll;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;
        $today = Carbon::now()->format('Y-m-d');
        // $hasPending = false;

        $absenPending = Absensi::where('approval_status', 'Pending')->count();
        $cutiPending = Cuti::where('approval_status', 'Pending')->count();
        $payrollPending = Payroll::where('approval_status', 'Pending')->count();

        // if($absenPending || $cutiPending || $payrollPending) {
        //     $hasPending = true;
        // }

        // Data untuk user biasa
        $absensiHariIni = Absensi::where('user_id', $userId)
            ->where('tanggal', $today)
            ->first();

        $cutiHariIni = Cuti::where('user_id', $userId)
            ->where('approval_status', 'Approved')
            ->where('tgl_mulai', '<=', date('Y-m-d'))
            ->where('tgl_selesai', '>=', date('Y-m-d'))
            ->first();

        $pengajuanCutiAktif = Cuti::where('user_id', $userId)
            ->whereIn('approval_status', ['Pending', 'Approved'])
            ->where('tgl_selesai', '>=', date('Y-m-d'))
            ->get();

        $isAdmin = $user->roles()->whereIn('name', ['admin', 'superadmin'])->exists();

        $data = [
            'absensiHariIni' => $absensiHariIni,
            'cutiHariIni' => $cutiHariIni,
            'pengajuanCutiAktif' => $pengajuanCutiAktif,
            'isAdmin' => $isAdmin,
        ];

        // admin handler
        if ($isAdmin) {
            $data['rekap_absensi'] = $this->getRekapAbsensiAllUsers();
            $data['dashboard_stats'] = $this->getDashboardStats();
            $data['chart_data'] = $this->getChartAbsensiData(); 
        }

        return Inertia::render('dashboard/index',  [
            ...$data,
            'pending' => [
                'absensi' => $absenPending,
                'cuti' => $cutiPending,
                'payroll' => $payrollPending,
            ],
        ]);
    }

    private function getRekapAbsensiAllUsers()
    {
        return User::with('divisi')
            ->whereHas('roles', function($q) {
                $q->whereNotIn('name', ['superadmin']); // Exclude superadmin
            })
            ->where('status', 'Aktif')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'divisi' => $user->divisi?->name,
                    'total_hadir' => Absensi::where('user_id', $user->id)
                        ->where('status', 'Hadir')
                        ->where('approval_status', 'Approved')
                        ->count(),
                    'total_telat' => Absensi::where('user_id', $user->id)
                        ->where('status', 'Telat')
                        ->where('approval_status', 'Approved')
                        ->count(),
                    'total_izin' => Absensi::where('user_id', $user->id)
                        ->whereIn('status', ['Sakit', 'Izin', 'Lainnya'])
                        ->where('approval_status', 'Approved')
                        ->count(),
                    'total_cuti' => Absensi::where('user_id', $user->id)
                        ->where('status', 'Cuti')
                        ->count(),
                    'total_alpha' => Absensi::where('user_id', $user->id)
                        ->where('status', 'Alpha')
                        ->where('approval_status', 'Approved')
                        ->count(),
                    'total_absensi' => Absensi::where('user_id', $user->id)->count(),
                ];
            });
    }

    
    private function getDashboardStats()
    {
        $today = Carbon::now()->format('Y-m-d');
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $totalKaryawan = User::whereHas('roles', function($q) {
            $q->whereNotIn('name', ['superadmin']);
        })
        ->where('status', 'Aktif')
        ->count();

        return [
            // Stats per Hari ini
            'hari_ini'=> [
                'hadir' =>Absensi::whereDate('tanggal', $today)
                ->whereIn('status', ['Hadir', 'Telat'])
                // ->where('approval_status', 'Approved')
                ->count(),
                'izin' => Absensi::whereDate('tanggal', $today)
                ->whereIn('status', ['Sakit', 'Izin', 'Lainnya'])
                ->where('approval_status', 'Approved')
                ->count(),
                'cuti' => Absensi::whereDate('tanggal', $today)
                ->where('status', 'Cuti')
                ->count(),
                'alpha' => $this->getAlphaHariIni($today),
            ],

            // Stats per Bulan ini
            'all_time' => [
                'hadir' => Absensi::whereYear('tanggal', $currentYear)
                    ->whereMonth('tanggal', $currentMonth)
                    ->whereIn('status', ['Hadir', 'Telat'])
                    ->where('approval_status', 'Approved')
                    ->count(),
                'izin' => Absensi::whereYear('tanggal', $currentYear)
                    ->whereMonth('tanggal', $currentMonth)
                    ->whereIn('status', ['Sakit', 'Izin', 'Lainnya'])
                    ->where('approval_status', 'Approved')
                    ->count(),
                'cuti' => Absensi::whereYear('tanggal', $currentYear)
                    ->whereMonth('tanggal', $currentMonth)
                    ->where('status', 'Cuti')
                    ->count(),
                'alpha' => Absensi::whereYear('tanggal', $currentYear)
                    ->whereMonth('tanggal', $currentMonth)
                    ->where('status', 'Alpha')
                    ->where('approval_status', 'Approved')
                    ->count(),
                'total_karyawan' => $totalKaryawan,
        ]
    ];
}

private function getAlphaHariIni($today)
{
    // Hitung karyawan aktif yang tidak ada absensi hari ini
    return User::where('status', 'Aktif')
        ->whereHas('roles', function($q) {
            $q->whereNotIn('name', ['superadmin']);
        })
        ->whereDoesntHave('absensis', function($q) use ($today) {
            $q->whereDate('tanggal', $today);
        })->count();
}

    private function getChartAbsensiData()
{
    $chartData = Absensi::whereYear('tanggal', now()->year)
        ->where('approval_status', 'Approved')
        ->selectRaw('MONTH(tanggal) as month, 
                SUM(CASE WHEN status IN ("Hadir", "Telat") THEN 1 ELSE 0 END) as hadir,
                SUM(CASE WHEN status = "Alpha" THEN 1 ELSE 0 END) as alpha,
                SUM(CASE WHEN status IN ("Sakit", "Izin", "Lainnya") THEN 1 ELSE 0 END) as izin,
                SUM(CASE WHEN status = "Cuti" THEN 1 ELSE 0 END) as cuti')
        ->groupBy('month')
        ->get()
        ->map(function($item) {
            return [
                'month' => Carbon::create()->month($item->month)->format('F'),
                'hadir' => (int) $item->hadir,
                'telat' => (int) $item->telat,
                'alpha' => (int) $item->alpha,
                'izin' => (int) $item->izin,
                'cuti' => (int) $item->cuti,
            ];
        })
        ->toArray();

    $allMonths = [];
    for ($i = 1; $i <= 12; $i++) {
        $monthName = Carbon::create()->month($i)->format('F');
        $existingMonth = collect($chartData)->firstWhere('month', $monthName);
        
        $allMonths[] = $existingMonth ?: [
            'month' => $monthName,
            'hadir' => 0,
            'telat' => 0,
            'alpha' => 0,
            'izin' => 0,
            'cuti' => 0,
        ];
    }

    return $allMonths;
}

    public function documentation()
    {
        return Inertia::render('dashboard/documentation', [
            'title' => 'App documentation',
            'content' => file_get_contents(base_path('README.md')),
        ]);
    }
}
