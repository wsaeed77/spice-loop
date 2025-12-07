<?php

namespace App\Http\Controllers;

use App\Models\WeeklyMenuOption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $weeklyCharge = config('app.weekly_subscription_charge', 50.00);
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
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string|max:255',
        ]);

        // Store subscription request - admin will create account
        // In production, you might want to store this in a separate table

        return redirect()->route('subscription')->with('message', 'Subscription request submitted! We will contact you soon to set up your account.');
    }
}
