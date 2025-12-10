<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\MenuItem;
use App\Models\Setting;
use App\Models\WeeklyMenuOption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $weeklyCharge = (float) Setting::get('weekly_menu_price', '50.00');
        $weeklyMenu = WeeklyMenuOption::with('menuItem')
            ->where('is_available', true)
            ->get()
            ->groupBy('day_of_week');

        $featuredItems = MenuItem::where('is_featured', true)
            ->where('is_available', true)
            ->limit(6)
            ->get();

        $weekendSpecial = MenuItem::where('is_weekend_special', true)
            ->where('is_available', true)
            ->first();

        return Inertia::render('Home', [
            'weeklyCharge' => $weeklyCharge,
            'weeklyMenu' => $weeklyMenu,
            'featuredItems' => $featuredItems,
            'weekendSpecial' => $weekendSpecial,
        ]);
    }
}
