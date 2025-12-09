<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => 'web'],
            ['name' => 'admin', 'guard_name' => 'web']
        );
        
        $subscriberRole = Role::firstOrCreate(
            ['name' => 'subscriber', 'guard_name' => 'web'],
            ['name' => 'subscriber', 'guard_name' => 'web']
        );

        // Create or update admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@spiceloop.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role using Spatie's method
        if (!$admin->hasRole('admin')) {
            $admin->assignRole($adminRole);
        }

        // Output success message
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('  ✅ Admin user created successfully!');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->newLine();
        $this->command->info('  📧 Email: admin@spiceloop.com');
        $this->command->info('  🔑 Password: password');
        $this->command->info('  👤 Role: Admin');
        $this->command->newLine();
        $this->command->warn('  ⚠️  IMPORTANT: Change the password in production!');
        $this->command->newLine();
    }
}
