<?php

namespace App\Http\Controllers;

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
        ]);

        \App\Models\SubscriptionRequest::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'status' => 'pending',
        ]);

        return redirect()->route('subscription')->with('message', 'Subscription request submitted! We will contact you soon to set up your account.');
    }
}
