<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Absensi;
use App\Models\User;
use Carbon\Carbon;

class GenerateAlpha extends Command
{
    // Nama command-nya (ini yang dipakai di Kernel)
    protected $signature = 'absensi:generate-alpha';
    protected $description = 'Generate absensi status alpha untuk karyawan yang belum absen hari ini';

    public function handle()
    {
        $today = Carbon::today();

        // Ambil semua user yang belum absen hari ini
        $usersWithoutAttendance = User::whereDoesntHave('absensis', function ($query) use ($today) {
            $query->whereDate('created_at', $today);
        })->get();

        foreach ($usersWithoutAttendance as $user) {
            Absensi::create([
                'user_id' => $user->id,
                'status' => 'alpha',
                'tanggal' => $today,
                'approval_status' => 'Approved'
            ]);
        }

        $this->info('Absensi alpha berhasil digenerate untuk user yang belum absen hari ini.');
    }
}
