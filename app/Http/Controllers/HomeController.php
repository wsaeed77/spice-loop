<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\WeeklyMenuOption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $weeklyCharge = config('app.weekly_subscription_charge', 50.00);
        $weeklyMenu = WeeklyMenuOption::with('menuItem')
            ->where('is_available', true)
            ->get()
            ->groupBy('day_of_week');

        return Inertia::render('Home', [
            'weeklyCharge' => $weeklyCharge,
            'weeklyMenu' => $weeklyMenu,
        ]);
    }
}
