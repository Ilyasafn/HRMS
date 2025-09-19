<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = User::create([
            'name' => 'Super administrator',
            'email' => 'admin@gmail.com',
            'password' => 'password',
        ]);
        $superadmin->assignRole('superadmin');

        User::factory(5)->create()->each(function ($user) {
            $user->assignRole('user');
        });
    }
}
