<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FixDishTypeEnum extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:dish-type-enum';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix the dish_type enum column to use Non-veg instead of Meat';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!Schema::hasTable('menu_items') || !Schema::hasColumn('menu_items', 'dish_type')) {
            $this->error('The menu_items table or dish_type column does not exist.');
            return 1;
        }

        $this->info('Fixing dish_type enum column...');

        try {
            // First, check current enum values
            $result = DB::select("SHOW COLUMNS FROM `menu_items` WHERE Field = 'dish_type'");
            if (!empty($result)) {
                $this->info('Current column definition: ' . $result[0]->Type);
            }

            // Update any existing 'Meat' values to 'Non-veg'
            $updated = DB::table('menu_items')
                ->where('dish_type', 'Meat')
                ->update(['dish_type' => 'Non-veg']);
            
            if ($updated > 0) {
                $this->info("Updated {$updated} record(s) from 'Meat' to 'Non-veg'.");
            }

            // Alter the enum column
            DB::statement("ALTER TABLE `menu_items` MODIFY COLUMN `dish_type` ENUM('Veg', 'Non-veg') NULL");
            
            $this->info('Successfully updated dish_type enum to include Non-veg!');
            
            // Verify the change
            $result = DB::select("SHOW COLUMNS FROM `menu_items` WHERE Field = 'dish_type'");
            if (!empty($result)) {
                $this->info('New column definition: ' . $result[0]->Type);
            }

            return 0;
        } catch (\Exception $e) {
            $this->error('Error fixing enum: ' . $e->getMessage());
            return 1;
        }
    }
}


