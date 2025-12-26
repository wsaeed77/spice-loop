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
        if (Schema::hasTable('subscription_requests') && !Schema::hasColumn('subscription_requests', 'selected_menu_items')) {
            Schema::table('subscription_requests', function (Blueprint $table) {
                $table->json('selected_menu_items')->nullable()->after('notes');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('subscription_requests') && Schema::hasColumn('subscription_requests', 'selected_menu_items')) {
            Schema::table('subscription_requests', function (Blueprint $table) {
                $table->dropColumn('selected_menu_items');
            });
        }
    }
};


