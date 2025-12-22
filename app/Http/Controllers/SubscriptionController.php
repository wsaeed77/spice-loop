<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Setting;
use App\Models\WeeklyMenuOption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $weeklyCharge = (float) Setting::get('weekly_menu_price', '50.00');
        $weeklyMenu = WeeklyMenuOption::with('menuItem')
            ->where('is_available', true)
            ->get()
            ->groupBy('day_of_week');

        return Inertia::render('Subscription', [
            'weeklyCharge' => $weeklyCharge,
            'weeklyMenu' => $weeklyMenu,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
            'selected_menu_items' => 'required|array',
            'selected_menu_items.monday' => 'required|exists:weekly_menu_options,id',
            'selected_menu_items.tuesday' => 'required|exists:weekly_menu_options,id',
            'selected_menu_items.wednesday' => 'required|exists:weekly_menu_options,id',
            'selected_menu_items.thursday' => 'required|exists:weekly_menu_options,id',
            'selected_menu_items.friday' => 'required|exists:weekly_menu_options,id',
        ]);

        // Validate that only 3 meat dishes are selected
        $selectedOptions = WeeklyMenuOption::with('menuItem')
            ->whereIn('id', array_values($validated['selected_menu_items']))
            ->get();

        $meatCount = $selectedOptions->filter(function ($option) {
            return $option->menuItem && $option->menuItem->dish_type === 'Non-veg';
        })->count();

        if ($meatCount > 3) {
            return back()->withErrors([
                'selected_menu_items' => 'You can only select a maximum of 3 non-veg dishes per week.'
            ])->withInput();
        }

        \App\Models\SubscriptionRequest::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'status' => 'pending',
            'selected_menu_items' => $validated['selected_menu_items'],
        ]);

        return redirect()->route('subscription')->with('message', 'Subscription request submitted! We will contact you soon to set up your account.');
    }
}
