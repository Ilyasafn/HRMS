<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cuti;
use App\Models\User;
use Carbon\Carbon;

class CutiSeeder extends Seeder
{
    public function run(): void
    {
        // $tahun = 2025;
        // $users = User::all();
        // $approvers = User::pluck('id')->toArray();

        // foreach ($users as $user) {
        //     $totalCuti = rand(2, 5);

        //     for ($i = 0; $i < $totalCuti; $i++) {
        //         $tgl_pengajuan = Carbon::createFromDate($tahun, rand(1, 12), rand(1, 28));
        //         $tgl_mulai = $tgl_pengajuan->copy()->addDays(rand(1, 10));
        //         $tgl_selesai = $tgl_mulai->copy()->addDays(rand(1, 5));
        //         $jumlahHari = $this->calculateWorkingDays($tgl_mulai, $tgl_selesai);

        //         // sebagian besar auto-approved biar langsung ke-count
        //         $approvalStatus = fake()->randomElement([
        //             'Approved', 'Approved', 'Approved', // 70% chance
        //             'Pending', 'Rejected'
        //         ]);

        //         $approvedBy = null;
        //         $approvedAt = null;

        //         // kalau status approved, langsung isi approved_by & approved_at
        //         if ($approvalStatus === 'Approved') {
        //             $approvedBy = fake()->randomElement($approvers);
        //             $approvedAt = $tgl_pengajuan->copy()->addHours(rand(2, 48));
        //         }

        //         Cuti::create([
        //             'user_id' => $user->id,
        //             'tgl_pengajuan' => $tgl_pengajuan,
        //             'tgl_mulai' => $tgl_mulai,
        //             'tgl_selesai' => $tgl_selesai,
        //             'alasan' => fake()->sentence(),
        //             'jenis_cuti' => fake()->randomElement([
        //                 'Cuti Tahunan',
        //                 'Cuti Besar',
        //                 'Cuti Sakit',
        //                 'Cuti Melahirkan',
        //                 'Cuti Lainnya',
        //             ]),
        //             'jumlah_hari' => $jumlahHari,
        //             'approval_status' => $approvalStatus,
        //             'approved_by' => $approvedBy,
        //             'approved_at' => $approvedAt,
        //         ]);
        //     }

        //     $this->command->info("Cuti user {$user->name} berhasil di-generate ($totalCuti data).");
        // }

        // $this->command->info("✅ Selesai generate data cuti tahun $tahun!");
         $today = Carbon::today(); // tanggal pengajuan cuti hari ini
        $users = User::all();
        $approvers = User::pluck('id')->toArray();

        foreach ($users as $user) {
            // Generate 1–2 data cuti per user buat hari ini biar realistis
            $totalCuti = rand(1, 2);

            for ($i = 0; $i < $totalCuti; $i++) {
                // Pengajuan hari ini
                $tgl_pengajuan = $today->copy();

                // Mulai cuti H+1 sampai H+10
                $tgl_mulai = $tgl_pengajuan->copy()->addDays(rand(1, 10));

                // Selesai cuti 1–5 hari setelah mulai
                $tgl_selesai = $tgl_mulai->copy()->addDays(rand(1, 5));

                // Hitung hari kerja doang (exclude weekend)
                $jumlahHari = $this->calculateWorkingDays($tgl_mulai, $tgl_selesai);

                $approvalStatus = fake()->randomElement([
                    'Approved', 'Approved', 'Approved', // 70% lebih besar
                    'Pending', 'Rejected'
                ]);

                $approvedBy = null;
                $approvedAt = null;

                if ($approvalStatus === 'Approved') {
                    $approvedBy = fake()->randomElement($approvers);
                    $approvedAt = $tgl_pengajuan->copy()->addHours(rand(2, 48));
                }

                Cuti::create([
                    'user_id'        => $user->id,
                    'tgl_pengajuan'  => $tgl_pengajuan,
                    'tgl_mulai'      => $tgl_mulai,
                    'tgl_selesai'    => $tgl_selesai,
                    'alasan'         => fake()->sentence(),
                    'jenis_cuti'     => fake()->randomElement([
                        'Cuti Tahunan',
                        'Cuti Besar',
                        'Cuti Sakit',
                        'Cuti Melahirkan',
                        'Cuti Lainnya',
                    ]),
                    'jumlah_hari'    => $jumlahHari,
                    'approval_status'=> $approvalStatus,
                    'approved_by'    => $approvedBy,
                    'approved_at'    => $approvedAt,
                ]);
            }

            $this->command->info("✅ Cuti user {$user->name} berhasil dibuat ($totalCuti data) untuk tanggal {$today->toDateString()}.");
        }

        $this->command->info("🎉 Seeder cuti harian selesai!");
    }

    private function calculateWorkingDays(Carbon $start, Carbon $end)
    {
        $totalDays = 0;
        $current = $start->copy();

        while ($current->lte($end)) {
            if (!$current->isWeekend()) {
                $totalDays++;
            }
            $current->addDay();
        }

        return $totalDays;
    }
}
