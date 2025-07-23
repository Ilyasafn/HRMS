<?php

namespace Database\Factories;

use App\Models\Divisi;
use App\Models\Jabatan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Karyawan>
 */
class KaryawanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'nik' => fake()->unique()->numerify('#####'),
            'divisi_id' => Divisi::pluck(column: 'id')->random(),
            'jabatan_id' => Jabatan::pluck(column: 'id')->random(),
            'alamat' => fake()->address(),
            'nomor_telepon' => fake()->phoneNumber(),
            'tgl_masuk' => fake()->date(),
            'status' => fake()->randomElement(['Aktif', 'Tidak Aktif'])
        ];
    }
}
