<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\MenuItem;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        // Show all menu items that are available (regardless of subscription status)
        // Sort by is_available_today (true first), then category, then name
        $menuItems = MenuItem::with('options')
            ->where('is_available', true)
            ->orderByDesc('is_available_today')
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'price' => $item->price,
                    'image' => $item->image,
                    'category' => $item->category,
                    'type' => $item->type,
                    'is_available' => $item->is_available,
                    'is_available_today' => $item->is_available_today,
                    'is_subscription_item' => $item->is_subscription_item,
                    'is_featured' => $item->is_featured,
                    'is_weekend_special' => $item->is_weekend_special,
                    'options' => $item->options->map(function ($option) {
                        return [
                            'id' => $option->id,
                            'name' => $option->name,
                            'price' => $option->price,
                        ];
                    }),
                ];
            });

        $cities = City::where('is_active', true)->get();
        $deliveryCost = (float) Setting::get('delivery_cost', '0.00');

        return Inertia::render('Menu', [
            'menuItems' => $menuItems,
            'cities' => $cities,
            'deliveryCost' => $deliveryCost,
        ]);
    }
}
