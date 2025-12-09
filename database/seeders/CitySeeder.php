<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        City::updateOrCreate(
            ['name' => 'Milton Keynes'],
            [
                'is_active' => true,
            ]
        );

        $this->command->info('City seeded: Milton Keynes');
    }
}
