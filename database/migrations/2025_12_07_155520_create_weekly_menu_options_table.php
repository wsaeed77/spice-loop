<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('weekly_menu_options')) {
            Schema::create('weekly_menu_options', function (Blueprint $table) {
                $table->id();
                $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
                $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
                $table->boolean('is_available')->default(true);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('weekly_menu_options');
    }
};
