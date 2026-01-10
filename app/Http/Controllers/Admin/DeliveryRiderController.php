<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryRider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryRiderController extends Controller
{
    public function index()
    {
        $riders = DeliveryRider::orderBy('name')->get();

        return Inertia::render('Admin/DeliveryRiders/Index', [
            'riders' => $riders,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/DeliveryRiders/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'is_active' => 'boolean',
        ]);

        DeliveryRider::create($validated);

        return redirect()->route('admin.riders.index')
            ->with('message', 'Delivery rider created successfully!');
    }

    public function edit($id)
    {
        $rider = DeliveryRider::findOrFail($id);

        return Inertia::render('Admin/DeliveryRiders/Edit', [
            'rider' => $rider,
        ]);
    }

    public function update(Request $request, $id)
    {
        $rider = DeliveryRider::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'is_active' => 'boolean',
        ]);

        $rider->update($validated);

        return redirect()->route('admin.riders.index')
            ->with('message', 'Delivery rider updated successfully!');
    }

    public function destroy($id)
    {
        $rider = DeliveryRider::findOrFail($id);
        
        // Check if rider has any orders
        if ($rider->orders()->count() > 0) {
            return redirect()->route('admin.riders.index')
                ->with('error', 'Cannot delete rider with assigned orders. Please reassign orders first.');
        }

        $rider->delete();

        return redirect()->route('admin.riders.index')
            ->with('message', 'Delivery rider deleted successfully!');
    }
}

