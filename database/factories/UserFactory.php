<?php

namespace Database\Factories;

use App\Models\Divisi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

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
    // Ambil role random kecuali superadmin
    // $role = Role::whereNot('name', 'superadmin')->inRandomOrder()->first();
    $role = Role::where('name', 'staff')->first();

    return [
        'name' => fake()->name(),
        'email' => fake()->unique()->safeEmail(),
        'email_verified_at' => now(),
        'password' => static::$password ??= Hash::make('password'),
        'nik' => fake()->unique()->numerify('########'),
        'divisi_id' => Divisi::pluck('id')->random(),
        'tgl_lahir' => fake()->date(),
        'tgl_masuk' => fake()->date(),
        'jenis_kelamin' => fake()->randomElement(['Laki-laki', 'Perempuan']),
        'alamat' => fake()->address(),
        'no_telp' => fake()->phoneNumber(),
        'status' => 'Aktif',
        // Ambil custom gaji dari role
        'custom_gaji_pokok' => $role?->gaji_pokok,
        'custom_tunjangan' => $role?->tunjangan,
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
