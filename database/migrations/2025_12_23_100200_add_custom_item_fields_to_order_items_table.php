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
        if (Schema::hasTable('order_items')) {
            // Get the actual foreign key constraint name
            $foreignKeys = DB::select("
                SELECT CONSTRAINT_NAME 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'order_items' 
                AND COLUMN_NAME = 'menu_item_id' 
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ");
            
            // Drop foreign key if it exists
            if (!empty($foreignKeys)) {
                $constraintName = $foreignKeys[0]->CONSTRAINT_NAME;
                DB::statement("ALTER TABLE `order_items` DROP FOREIGN KEY `{$constraintName}`");
            }
            
            // Make menu_item_id nullable to allow custom items
            if (Schema::hasColumn('order_items', 'menu_item_id')) {
                DB::statement('ALTER TABLE `order_items` MODIFY COLUMN `menu_item_id` BIGINT UNSIGNED NULL');
            }
            
            // Re-add the foreign key constraint (nullable)
            if (!empty($foreignKeys)) {
                DB::statement('ALTER TABLE `order_items` ADD CONSTRAINT `order_items_menu_item_id_foreign` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE');
            }
            
            // Add custom item fields
            Schema::table('order_items', function (Blueprint $table) {
                if (!Schema::hasColumn('order_items', 'custom_item_name')) {
                    $table->string('custom_item_name')->nullable()->after('menu_item_option_id');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                $table->dropColumn('custom_item_name');
                
                // Make menu_item_id required again
                $table->dropForeign(['menu_item_id']);
                $table->foreignId('menu_item_id')->nullable(false)->change();
                $table->foreign('menu_item_id')->references('id')->on('menu_items')->onDelete('cascade');
            });
        }
    }
};

