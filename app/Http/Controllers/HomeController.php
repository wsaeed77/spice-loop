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

        $weekendSpecial = MenuItem::with('options')
            ->where('is_weekend_special', true)
            ->where('is_available', true)
            ->first();
        
        // Format weekend special with options if it exists
        if ($weekendSpecial) {
            $weekendSpecial = [
                'id' => $weekendSpecial->id,
                'name' => $weekendSpecial->name,
                'description' => $weekendSpecial->description,
                'price' => $weekendSpecial->price,
                'image' => $weekendSpecial->image,
                'category' => $weekendSpecial->category,
                'type' => $weekendSpecial->type,
                'is_available' => $weekendSpecial->is_available,
                'is_available_today' => $weekendSpecial->is_available_today,
                'is_subscription_item' => $weekendSpecial->is_subscription_item,
                'is_featured' => $weekendSpecial->is_featured,
                'is_weekend_special' => $weekendSpecial->is_weekend_special,
                'options' => $weekendSpecial->options->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'name' => $option->name,
                        'price' => $option->price,
                    ];
                }),
            ];
        }

        return Inertia::render('Home', [
            'weeklyCharge' => $weeklyCharge,
            'weeklyMenu' => $weeklyMenu,
            'featuredItems' => $featuredItems,
            'weekendSpecial' => $weekendSpecial,
        ]);
    }
}
