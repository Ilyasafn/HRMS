<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'superadmin', 'gaji_pokok' => 0, 'tunjangan' => 0],
            ['name' => 'admin', 'gaji_pokok' => 5000000, 'tunjangan' => 2500000],
            ['name' => 'staff', 'gaji_pokok' => 4000000, 'tunjangan' => 500000],
            ['name' => 'supervisor', 'gaji_pokok' => 10000000, 'tunjangan' => 3500000],
            ['name' => 'manager', 'gaji_pokok' => 17500000, 'tunjangan' => 5000000],
        ];

        foreach ($roles as $data) {
            Role::updateOrCreate(
                ['name' => $data['name']],
                ['gaji_pokok' => $data['gaji_pokok'], 'tunjangan' => $data['tunjangan']]
            );
        }
    }
}
