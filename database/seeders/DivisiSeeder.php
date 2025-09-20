<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Divisi;

class DivisiSeeder extends Seeder
{
    public function run(): void
    {
        Divisi::create([
            'name' => 'Admin',
            'description' => 'Divisi ADMIN',
        ]);
        Divisi::create([
            'name' => 'HRD',
            'description' => 'Divisi HRD',
        ]);
        Divisi::create([
            'name' => 'IT',
            'description' => 'Divisi IT',
        ]);
    }
}
