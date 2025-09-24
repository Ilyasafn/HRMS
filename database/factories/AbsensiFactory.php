<?php

namespace Database\Factories;

use App\Models\Absensi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AbsensiFactory extends Factory
{
    protected $model = Absensi::class;

    public function definition(): array
    {
        return [
            'user_id' => User::pluck('id')->random(),
            'tanggal' => fake()->dateTimeBetween('now', '+1 month'),
            'jam_masuk' => fake()->time(),
            'jam_keluar' => fake()->time(),
            'status' => fake()->randomElement(['Hadir', 'Telat', 'Sakit', 'Izin', 'Cuti', 'Alpha']),
            'keterangan' => fake()->sentence(),
            'approval_status' => fake()->randomElement(['Pending', 'Approved', 'Rejected']),
            'approved_by' => User::pluck('id')->random(),
            'approved_at' => fake()->dateTimeBetween('now', '+1 year'),
        ];
    }
}
