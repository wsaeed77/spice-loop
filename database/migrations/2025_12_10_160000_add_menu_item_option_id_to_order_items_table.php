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
        if (Schema::hasTable('order_items') && !Schema::hasColumn('order_items', 'menu_item_option_id')) {
            Schema::table('order_items', function (Blueprint $table) {
                $table->foreignId('menu_item_option_id')->nullable()->after('menu_item_id')->constrained('menu_item_options')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['menu_item_option_id']);
            $table->dropColumn('menu_item_option_id');
        });
    }
};

