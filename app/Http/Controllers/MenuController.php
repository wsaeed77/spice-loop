<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $menuItems = MenuItem::where('is_available', true)
            ->where('is_subscription_item', false)
            ->get();

        $cities = City::where('is_active', true)->get();

        return Inertia::render('Menu', [
            'menuItems' => $menuItems,
            'cities' => $cities,
        ]);
    }
}
