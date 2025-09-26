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
        $today = Carbon::today()->toDateString();
        
        foreach( User::all() as $user) {
            $checkin = Carbon::createFromTime(9, 0)->addMinutes(rand(-60,30));
            $checkout = Carbon::createFromTime(17, 0)->addMinutes(rand(-30, 0));

            $status = $checkin->gt(Carbon::createFromTime(9, 0)) ? 'Telat' : 'Hadir';
            Absensi::updateOrCreate([
                'user_id' => $user->id,
                'tanggal' => $today,
            ],
            [
                'jam_masuk' => $checkin->format('H:i:s'), // random time pagi
                'jam_keluar' => $checkout->format('H:i:s'), // random sore
                'status' => $status,
                'keterangan' => fake()->sentence(),
                'approval_status' => fake()->randomElement(['Pending', 'Approved', 'Rejected']),
                'approved_by' => User::pluck('id')->toArray()[0],
                'approved_at' => Carbon::now()->addHours(rand(1, 3)),
            ]
        );
    };
    }
}
