<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('menu_items') && Schema::hasColumn('menu_items', 'dish_type')) {
            // First, update any existing 'Meat' values to 'Non-veg'
            DB::table('menu_items')
                ->where('dish_type', 'Meat')
                ->update(['dish_type' => 'Non-veg']);

            // Then alter the enum column
            // Note: MySQL doesn't support direct enum modification, so we need to use raw SQL
            DB::statement("ALTER TABLE `menu_items` MODIFY COLUMN `dish_type` ENUM('Veg', 'Non-veg') NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('menu_items') && Schema::hasColumn('menu_items', 'dish_type')) {
            // Update any existing 'Non-veg' values back to 'Meat'
            DB::table('menu_items')
                ->where('dish_type', 'Non-veg')
                ->update(['dish_type' => 'Meat']);

            // Revert the enum column
            DB::statement("ALTER TABLE `menu_items` MODIFY COLUMN `dish_type` ENUM('Veg', 'Meat') NULL");
        }
    }
};


