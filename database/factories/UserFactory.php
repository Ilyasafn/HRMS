<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('admin123'),
            'nik' => fake()->unique()->numerify('########'), // NIK = 8 digit, 2 angka thn masuk, 2 angka bln masuk, 2 angka divisi_id, 2 angka terakhir urutan masuk
            'tgl_lahir' => fake()->date(),
            'jenis_kelamin' => fake()->randomElement(['Laki-laki', 'Perempuan']),
            'alamat' => fake()->address(),
            'nomor_telepon' => fake()->phoneNumber(),
            'tgl_masuk' => fake()->date(),
            'status' => fake()->randomElement(['Aktif', 'Tidak Aktif']),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
