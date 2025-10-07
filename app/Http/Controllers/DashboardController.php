<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Cuti;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{

    
    public function index()
    {
        $userId = Auth::user()->id;
        $today = Carbon::now()->format('Y-m-d');

        $absensiHariIni = Absensi::where('user_id', $userId)
        ->where('tanggal', $today)
        ->first();

         // CUTI HARI INI (sedang berlangsung)
        $cutiHariIni = Cuti::where('user_id', Auth::id())
            ->whereIn('approval_status', ['Pending', 'Approved'])
            ->where('tgl_mulai', '<=', date('Y-m-d'))
            ->where('tgl_selesai', '>=', date('Y-m-d'))
            ->first();

        // PENGAJUAN CUTI AKTIF (semua cuti yang pending/approved)
        $pengajuanCutiAktif = Cuti::where('user_id', Auth::id())
            ->whereIn('approval_status', ['Pending', 'Approved'])
            ->where('tgl_selesai', '>=', date('Y-m-d')) // Masih berlaku
            ->get();

             // ✅ DEBUG: Data yang akan dikirim
        logger('Dashboard Data:', [
            'user_id' => Auth::id(),
            'absensi' => $absensiHariIni ? $absensiHariIni->toArray() : null,
            'cuti_hari_ini' => $cutiHariIni ? $cutiHariIni->toArray() : null,
            'pengajuan_cuti_aktif' => $pengajuanCutiAktif->toArray(),
            'today' => date('Y-m-d')
        ]);

        return Inertia::render('dashboard/index', [
            'absensiHariIni' => $absensiHariIni,
            'cutiHariIni' => $cutiHariIni,
            'pengajuanCutiAktif' => $pengajuanCutiAktif,
        ]);

    //  $absensiHariIni = null;
    // $cutiHariIni = null;
    // $pengajuanCutiAktif = Cuti::where('user_id', Auth::id())->get(); // Ambil semua dulu

    // // ✅ RETURN JSON LANGSUNG (temporary)
    // return response()->json([
    //     'debug' => 'Dashboard Data',
    //     'absensiHariIni' => $absensiHariIni,
    //     'cutiHariIni' => $cutiHariIni,
    //     'pengajuanCutiAktif' => $pengajuanCutiAktif->toArray(),
    //     'user_id' => Auth::id(),
    //     'cuti_count' => $pengajuanCutiAktif->count()
    // ]);
    }

    public function documentation()
    {
        return Inertia::render('dashboard/documentation', [
            'title' => 'App documentation',
            'content' => file_get_contents(base_path('README.md')),
        ]);
    }
}
