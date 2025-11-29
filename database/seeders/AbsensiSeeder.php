<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\Models\Absensi;
use App\Models\User;

class AbsensiSeeder extends Seeder
{
    public function run(): void
    {
        // $tahun = 2025;
        // $users = User::all();

        // $statusOptions = ['Hadir', 'Telat', 'Izin', 'Sakit', 'Alpha'];
        // $approvalOptions = ['Approved', 'Pending', 'Rejected'];

        // foreach ($users as $user) {
        //     for ($bulan = 1; $bulan <= 12; $bulan++) {
        //         $daysInMonth = Carbon::create($tahun, $bulan, 1)->daysInMonth;

        //         for ($tanggal = 1; $tanggal <= $daysInMonth; $tanggal++) {
        //             $currentDay = Carbon::create($tahun, $bulan, $tanggal);

        //             // skip weekend
        //             if ($currentDay->isWeekend()) continue;

        //             $status = $statusOptions[array_rand($statusOptions)];
        //             $approval = $approvalOptions[array_rand($approvalOptions)];

        //             if (in_array($status, ['Izin', 'Sakit', 'Alpa'])) {
        //                 $checkin = null;
        //                 $checkout = null;
        //             } else {
        //                 $checkin = Carbon::createFromTime(9, 0)->addMinutes(rand(-60, 30));
        //                 $checkout = Carbon::createFromTime(17, 0)->addMinutes(rand(-30, 0));

        //                 if ($status === 'Hadir' && $checkin->gt(Carbon::createFromTime(9, 0))) {
        //                     $status = 'Telat';
        //                 }
        //             }

        //             Absensi::create([
        //                 'user_id' => $user->id,
        //                 'tanggal' => $currentDay->toDateString(),
        //                 'jam_masuk' => $checkin ? $checkin->format('H:i:s') : null,
        //                 'jam_keluar' => $checkout ? $checkout->format('H:i:s') : null,
        //                 'status' => $status,
        //                 'keterangan' => fake()->sentence(),
        //                 'approval_status' => $approval,
        //                 'approved_by' => $users->random()->id,
        //                 'approved_at' => $approval === 'Approved' ? $currentDay->copy()->addHours(rand(1, 3)) : null,
        //             ]);
        //         }
        //     }

        //     $this->command->info("Absensi user {$user->name} berhasil di-generate untuk tahun $tahun");
        // }

        // $this->command->info("✅ Selesai seeding absensi realistis per bulan!");

        $today = Carbon::today(); // tanggal hari ini
        $users = User::all();

        $statusOptions = ['Hadir', 'Telat', 'Izin', 'Sakit', 'Alpha'];
        $approvalOptions = ['Approved', 'Pending', 'Rejected'];

        foreach ($users as $user) {
            // Skip kalau weekend
            // if ($today->isWeekend()) {
            //     $this->command->warn("⚠️ Hari ini libur (Weekend), ga ada absensi yang dibuat.");
            //     return;
            // }

            $status = $statusOptions[array_rand($statusOptions)];
            $approval = $approvalOptions[array_rand($approvalOptions)];

            // Kalau izin/sakit/alpha -> ga ada jam masuk/keluar
            if (in_array($status, ['Izin', 'Sakit', 'Alpha'])) {
                $checkin = null;
                $checkout = null;
            } else {
                $checkin = Carbon::createFromTime(9, 0)->addMinutes(rand(-60, 30)); // bisa telat
                $checkout = Carbon::createFromTime(17, 0)->addMinutes(rand(-30, 0));

                // Kalau status awal Hadir tapi checkin lebih dari jam 9 → ubah jadi Telat
                if ($status === 'Hadir' && $checkin->gt(Carbon::createFromTime(9, 0))) {
                    $status = 'Telat';
                }
            }

            Absensi::create([
                'user_id'       => $user->id,
                'tanggal'       => $today->toDateString(),
                'jam_masuk'     => $checkin ? $checkin->format('H:i:s') : null,
                'jam_keluar'    => $checkout ? $checkout->format('H:i:s') : null,
                'status'        => $status,
                'keterangan'    => fake()->sentence(),
                'approval_status' => $approval,
                'approved_by'     => $users->random()->id,
                'approved_at'     => $approval === 'Approved'
                    ? $today->copy()->addHours(rand(1, 3))
                    : null,
            ]);
        }

        $this->command->info("✅ Absensi untuk semua user berhasil di-generate untuk tanggal {$today->toDateString()}!");
    }
}
