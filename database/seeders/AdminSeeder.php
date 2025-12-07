<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin role
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $subscriberRole = Role::firstOrCreate(['name' => 'subscriber', 'guard_name' => 'web']);

        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@spiceloop.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign role using DB directly
        $roleExists = \DB::table('model_has_roles')
            ->where('model_type', User::class)
            ->where('model_id', $admin->id)
            ->where('role_id', $adminRole->id)
            ->exists();
            
        if (!$roleExists) {
            \DB::table('model_has_roles')->insert([
                'role_id' => $adminRole->id,
                'model_type' => User::class,
                'model_id' => $admin->id,
            ]);
        }

        $this->command->info('Admin user created:');
        $this->command->info('Email: admin@spiceloop.com');
        $this->command->info('Password: password');
    }
}
