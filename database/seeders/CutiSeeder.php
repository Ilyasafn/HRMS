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
        $users = User::all();
        $approverId = User::first()->id;

        $today = Carbon::today()->format('Y-m-d');
        
        foreach($users as $user){
            $tgl_pengajuan = Carbon::today()->subDays(rand(1,30));
            $tgl_mulai = $tgl_pengajuan->copy()->addDays(rand(1,30));
            $tgl_selesai = $tgl_mulai->copy()->addDays(rand(1,12));

            $jumlahHari  = $this->calculateWorkingDays($tgl_mulai, $tgl_selesai);

            $approvalStatus = $tgl_pengajuan->isPast() 
            ? fake()->randomElement(['Pending', 'Approved', 'Rejected']) 
            : 'Pending';

            $approvedBy = null;
            $approvedAt = null;

            if(in_array($approvalStatus, ['Approved', 'Rejected', 'Canceled'])){ 
                $approvedBy = $approverId;
                $approvedAt = $tgl_pengajuan->copy()->addHours(rand(1, 48));
            } 

            Cuti::updateOrCreate([
                'user_id' => $user->id,
                'tgl_pengajuan' => $today,
            ],
            [
                    'tgl_mulai' => $tgl_mulai,
                    'tgl_selesai' => $tgl_selesai,
                    'alasan' => fake()->sentence(),
                    'jenis_cuti' => fake()->randomElement(
                    [
                        'Cuti Tahunan', 
                        'Cuti Besar', 
                        'Cuti Sakit', 
                        'Cuti Melahirkan', 
                        'Cuti Lainnya',
                    ]),
                    'jumlah_hari' => $jumlahHari,
                    'approval_status' => $approvalStatus,
                    'approved_by' => $approvedBy,
                    'approved_at' => $approvedAt,
            ]
            );
        }
    }

    private function calculateWorkingDays(Carbon $start, Carbon $end) {
        $totalDays = 0;
        $current = $start->copy();

        while($current->lte($end)) {
            if(!$current->isWeekend()) {
                $totalDays++;
            }
            $current->addDay();
        }

        return $totalDays;
    }
}
