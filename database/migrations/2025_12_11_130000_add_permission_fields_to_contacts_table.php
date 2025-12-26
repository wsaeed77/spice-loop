<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('contacts')) {
            Schema::table('contacts', function (Blueprint $table) {
                $table->boolean('allow_sms_promotions')->default(false)->after('is_existing_customer');
                $table->boolean('allow_whatsapp_promotions')->default(false)->after('allow_sms_promotions');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('contacts')) {
            Schema::table('contacts', function (Blueprint $table) {
                $table->dropColumn(['allow_sms_promotions', 'allow_whatsapp_promotions']);
            });
        }
    }
};

