<?php

namespace Database\Factories;

use App\Models\Payroll;
use App\Models\User;
use App\Models\ApprovedBy;
use Illuminate\Database\Eloquent\Factories\Factory;

class PayrollFactory extends Factory
{
    protected $model = Payroll::class;

    public function definition(): array
    {
        return [
            'user_id' => User::pluck('id')->random(),
            'periode' => now()->format('Y-m'),
            'gaji_pokok' => fake()->numberBetween(1000000, 5000000),
            'tunjangan' => fake()->numberBetween(1000000, 5000000),
            'potongan' => fake()->numberBetween(0, 0),
            'total_gaji' => fake()->numberBetween(1000000, 5000000),
            'tanggal' => fake()->dateTimeBetween('now', '+1 month'),
            'status' => fake()->randomElement(['Draft', 'Finalized']),
            'approval_status' => fake()->randomElement(['Pending', 'Approved', 'Rejected']),
            'approved_by' => User::pluck('id')->random(),
            'approved_at' => fake()->dateTimeBetween('now', '+1 day'),
        ];
    }
}
