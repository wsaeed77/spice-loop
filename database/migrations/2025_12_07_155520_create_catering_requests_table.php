<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('catering_requests')) {
            Schema::create('catering_requests', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email');
                $table->string('phone');
                $table->string('event_type');
                $table->date('event_date');
                $table->integer('number_of_guests');
                $table->text('location');
                $table->text('special_requirements')->nullable();
                $table->enum('status', ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'])->default('pending');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('catering_requests');
    }
};
