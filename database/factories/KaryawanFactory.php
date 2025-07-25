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
            'nik' => fake()->unique()->numerify('########'), // NIK = 8 digit, 2 angka bln masuk, 2 angka thn masuk, 2 angka divisi_id, 2 angka terakhir urutan masuk
            'alamat' => fake()->address(),
            'nomor_telepon' => fake()->phoneNumber(),
            'tgl_masuk' => fake()->date(),
            'status' => fake()->randomElement(['Aktif', 'Tidak Aktif'])
        ];
    }
}
