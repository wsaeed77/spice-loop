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
        if (Schema::hasTable('menu_items') && !Schema::hasColumn('menu_items', 'is_weekend_special')) {
            Schema::table('menu_items', function (Blueprint $table) {
                $table->boolean('is_weekend_special')->default(false)->after('is_featured');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn('is_weekend_special');
        });
    }
};

