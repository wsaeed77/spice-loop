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
        // Show all menu items that are available (regardless of subscription status)
        $menuItems = MenuItem::where('is_available', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get();

        $cities = City::where('is_active', true)->get();

        return Inertia::render('Menu', [
            'menuItems' => $menuItems,
            'cities' => $cities,
        ]);
    }
}
