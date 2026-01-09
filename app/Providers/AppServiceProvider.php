<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schedule;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Schedule the order status update command to run every 5 minutes
        Schedule::command('orders:update-statuses')
            ->everyFiveMinutes()
            ->withoutOverlapping();
    }
}
