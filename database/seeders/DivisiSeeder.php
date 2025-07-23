<?php

namespace Database\Seeders;

use App\Models\Divisi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DivisiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Divisi::create([
            'nama' => 'Admin',
            'keterangan' => 'Divisi ADMIN',
        ]);
        Divisi::create([
            'nama' => 'HRD',
            'keterangan' => 'Divisi HRD',
        ]);
        Divisi::create([
            'nama' => 'IT',
            'keterangan' => 'Divisi IT',
        ]);
    }
}
