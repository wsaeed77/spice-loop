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
        if (Schema::hasTable('orders')) {
            // Add delivery_date and delivery_time fields
            Schema::table('orders', function (Blueprint $table) {
                if (!Schema::hasColumn('orders', 'delivery_date')) {
                    $table->date('delivery_date')->nullable()->after('status');
                }
                if (!Schema::hasColumn('orders', 'delivery_time')) {
                    $table->time('delivery_time')->nullable()->after('delivery_date');
                }
            });

            // Update status enum to include new statuses
            // For MySQL/MariaDB, we need to modify the enum using raw SQL
            DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'In Queue', 'preparing', 'out for delivery', 'delivered', 'cancelled', 'confirmed', 'ready') DEFAULT 'pending'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn(['delivery_date', 'delivery_time']);
            });

            // Revert status enum to original
            DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending'");
        }
    }
};

