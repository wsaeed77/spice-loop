<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('contacts')) {
            Schema::create('contacts', function (Blueprint $table) {
                $table->id();
                $table->string('phone')->unique();
                $table->string('name')->nullable();
                $table->string('email')->nullable();
                $table->text('address')->nullable();
                $table->string('postcode')->nullable();
                $table->boolean('is_existing_customer')->default(false);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};

