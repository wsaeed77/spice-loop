<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\WeeklyMenuOption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeeklyMenuController extends Controller
{
    public function index()
    {
        $weeklyMenu = WeeklyMenuOption::with('menuItem')
            ->get()
            ->groupBy('day_of_week');

        $menuItems = MenuItem::where('is_subscription_item', true)->get();

        return Inertia::render('Admin/WeeklyMenu/Index', [
            'weeklyMenu' => $weeklyMenu,
            'menuItems' => $menuItems,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday',
            'is_available' => 'boolean',
        ]);

        WeeklyMenuOption::updateOrCreate(
            [
                'menu_item_id' => $validated['menu_item_id'],
                'day_of_week' => $validated['day_of_week'],
            ],
            [
                'is_available' => $validated['is_available'] ?? true,
            ]
        );

        return redirect()->route('admin.weekly-menu.index')->with('message', 'Weekly menu option saved successfully!');
    }

    public function destroy($id)
    {
        $weeklyMenuOption = WeeklyMenuOption::findOrFail($id);
        $weeklyMenuOption->delete();

        return redirect()->route('admin.weekly-menu.index')->with('message', 'Weekly menu option deleted successfully!');
    }
}
