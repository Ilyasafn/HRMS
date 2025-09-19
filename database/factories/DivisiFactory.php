<?php

namespace Database\Factories;

use App\Models\Divisi;

use Illuminate\Database\Eloquent\Factories\Factory;

class DivisiFactory extends Factory
{
    protected $model = Divisi::class;

    public function definition(): array
    {
        return [
            'name' => fake()->sentence(),
            'description' => fake()->sentence(),
        ];
    }
}
