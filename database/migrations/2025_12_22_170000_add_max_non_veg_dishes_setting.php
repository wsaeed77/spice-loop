<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('settings')) {
            // Check if the setting doesn't already exist
            $existing = DB::table('settings')->where('key', 'max_non_veg_dishes')->first();
            if (!$existing) {
                DB::table('settings')->insert([
                    ['key' => 'max_non_veg_dishes', 'value' => '3', 'created_at' => now(), 'updated_at' => now()],
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('settings')) {
            DB::table('settings')->where('key', 'max_non_veg_dishes')->delete();
        }
    }
};



