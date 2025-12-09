<?php

namespace App\Http\Controllers;

use App\Models\DailySelection;
use App\Models\MenuItem;
use App\Models\WeeklyMenuOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriberController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }

        $today = now()->format('Y-m-d');
        $dayOfWeek = strtolower(now()->format('l'));
        $tomorrow = now()->addDay()->format('Y-m-d');
        $tomorrowDayOfWeek = strtolower(now()->addDay()->format('l'));
        
        $availableItems = WeeklyMenuOption::with('menuItem')
            ->where('day_of_week', $tomorrowDayOfWeek)
            ->where('is_available', true)
            ->get()
            ->pluck('menuItem')
            ->filter();

        $todaySelection = DailySelection::where('user_id', $user->id)
            ->where('selection_date', $today)
            ->with('menuItem')
            ->first();

        $upcomingSelections = DailySelection::where('user_id', $user->id)
            ->where('selection_date', '>', $today)
            ->with('menuItem')
            ->orderBy('selection_date')
            ->get();

        // Check if selection window is open (before 12am of the day)
        $canSelectToday = now()->format('H:i') < '23:59';

        return Inertia::render('Subscriber/Dashboard', [
            'availableItems' => $availableItems,
            'todaySelection' => $todaySelection,
            'upcomingSelections' => $upcomingSelections,
            'canSelectToday' => $canSelectToday,
            'tomorrow' => $tomorrow,
        ]);
    }

    public function selectItem(Request $request)
    {
        $validated = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'selection_date' => 'required|date',
        ]);

        $user = Auth::user();
        $selectionDate = $validated['selection_date'];
        $dayOfWeek = strtolower(date('l', strtotime($selectionDate)));

        // Check if selection is for tomorrow (next day)
        $tomorrow = now()->addDay()->format('Y-m-d');
        if ($selectionDate !== $tomorrow) {
            return back()->withErrors([
                'selection_date' => 'You can only select items for tomorrow.',
            ]);
        }

        // Check if selection window is open (before 12am of the day)
        if (now()->format('H:i') >= '23:59') {
            return back()->withErrors([
                'selection_date' => 'Selection window is closed. You can select items for tomorrow before 12am.',
            ]);
        }

        // Check if item is available for that day
        $weeklyOption = WeeklyMenuOption::where('menu_item_id', $validated['menu_item_id'])
            ->where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->first();

        if (!$weeklyOption) {
            return back()->withErrors([
                'menu_item_id' => 'This item is not available for the selected day.',
            ]);
        }

        // Check if user already has a selection for that date
        $existingSelection = DailySelection::where('user_id', $user->id)
            ->where('selection_date', $selectionDate)
            ->first();

        if ($existingSelection) {
            $existingSelection->update([
                'menu_item_id' => $validated['menu_item_id'],
                'status' => 'pending',
            ]);
        } else {
            DailySelection::create([
                'user_id' => $user->id,
                'menu_item_id' => $validated['menu_item_id'],
                'selection_date' => $selectionDate,
                'status' => 'pending',
            ]);
        }

        return redirect()->route('subscriber.dashboard')->with('message', 'Selection saved successfully!');
    }
}
