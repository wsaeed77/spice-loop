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
        if (Schema::hasTable('orders') && Schema::hasColumn('orders', 'delivery_distance')) {
            // Check current column type
            $columnInfo = DB::select("SHOW COLUMNS FROM orders WHERE Field = 'delivery_distance'");
            
            if (!empty($columnInfo)) {
                $columnType = $columnInfo[0]->Type;
                
                // If it's decimal, change to integer
                if (strpos($columnType, 'decimal') !== false || strpos($columnType, 'DECIMAL') !== false) {
                    Schema::table('orders', function (Blueprint $table) {
                        // First, convert existing decimal values to integer (round them)
                        DB::statement('UPDATE orders SET delivery_distance = ROUND(delivery_distance) WHERE delivery_distance IS NOT NULL');
                        
                        // Change column type to integer
                        $table->integer('delivery_distance')->nullable()->comment('Drive distance in minutes')->change();
                    });
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('orders') && Schema::hasColumn('orders', 'delivery_distance')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->decimal('delivery_distance', 8, 2)->nullable()->comment('Distance in miles or km')->change();
            });
        }
    }
};

