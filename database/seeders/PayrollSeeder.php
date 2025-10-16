<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payroll;

class PayrollSeeder extends Seeder
{
    public function run(): void
    {
        Payroll::factory()->count(5)->create();
    }
}