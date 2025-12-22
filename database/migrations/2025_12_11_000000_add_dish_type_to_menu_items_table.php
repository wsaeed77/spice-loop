<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('menu_items') && !Schema::hasColumn('menu_items', 'dish_type')) {
            Schema::table('menu_items', function (Blueprint $table) {
                $table->enum('dish_type', ['Veg', 'Meat'])->nullable()->after('type');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('menu_items') && Schema::hasColumn('menu_items', 'dish_type')) {
            Schema::table('menu_items', function (Blueprint $table) {
                $table->dropColumn('dish_type');
            });
        }
    }
};

