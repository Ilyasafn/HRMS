<?php

namespace Database\Factories;

use App\Models\Cuti;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CutiFactory extends Factory
{
    protected $model = Cuti::class;

    public function definition(): array
    {
        return [
            'user_id' => User::pluck('id')->random(),
            'tgl_pengajuan' => fake()->dateTimeBetween('now', '+1 day'),
            'tgl_mulai' => fake()->dateTimeBetween('now', '+1 week'),
            'tgl_selesai' => fake()->dateTimeBetween('+1 week', '+2 week'),
            'jumlah_hari' => fake()->numberBetween(1, 12),
            'alasan' => fake()->sentence(),
            'jenis_cuti' => fake()->randomElement([
                'Cuti Tahunan', 
                'Cuti Besar', 
                'Cuti Sakit', 
                'Cuti Melahirkan', 
                'Cuti Lainnya'
            ]),
            'approval_status' => fake()->randomElement([
                "Pending", 
                "Approved", 
                "Rejected",
                "Canceled"
            ]),
            'approved_by' => User::pluck('id')->random(),
            'approved_at' => fake()->dateTimeBetween('now', '+1 day'),
        ];
    }
}
