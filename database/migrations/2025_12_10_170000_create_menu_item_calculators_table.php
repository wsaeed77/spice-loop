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
        if (!Schema::hasTable('menu_item_calculators')) {
            Schema::create('menu_item_calculators', function (Blueprint $table) {
                $table->id();
                $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
                $table->json('ingredients'); // Store array of {name, cost}
                $table->decimal('packaging_cost', 10, 2)->default(0);
                $table->decimal('delivery_cost', 10, 2)->default(0);
                $table->decimal('others_cost', 10, 2)->default(0);
                $table->decimal('total_cost', 10, 2)->default(0);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_item_calculators');
    }
};

