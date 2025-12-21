<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\MenuItemCalculator;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuItemCalculatorController extends Controller
{
    public function show($menuItemId)
    {
        $menuItem = MenuItem::findOrFail($menuItemId);
        $calculator = MenuItemCalculator::where('menu_item_id', $menuItemId)->first();
        $deliveryCost = (float) Setting::get('delivery_cost', '0.00');

        return Inertia::render('Admin/MenuItemCalculator/Index', [
            'menuItem' => [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
            ],
            'calculator' => $calculator ? [
                'id' => $calculator->id,
                'ingredients' => $calculator->ingredients,
                'packaging_cost' => (string) $calculator->packaging_cost,
                'delivery_cost' => (string) $calculator->delivery_cost,
                'others_cost' => (string) $calculator->others_cost,
                'total_cost' => (string) $calculator->total_cost,
            ] : null,
            'deliveryCost' => $deliveryCost,
        ]);
    }

    public function store(Request $request, $menuItemId)
    {
        $menuItem = MenuItem::findOrFail($menuItemId);

        $validated = $request->validate([
            'ingredients' => 'required|array|min:1',
            'ingredients.*.name' => 'required|string|max:255',
            'ingredients.*.cost' => 'required|numeric|min:0',
            'ingredients.*.quantity' => 'nullable|string|max:255',
            'packaging_cost' => 'required|numeric|min:0',
            'delivery_cost' => 'required|numeric|min:0',
            'others_cost' => 'nullable|numeric|min:0',
        ]);

        // Calculate total cost
        $ingredientsTotal = collect($validated['ingredients'])->sum(function ($ingredient) {
            return (float) $ingredient['cost'];
        });

        $totalCost = $ingredientsTotal + 
                     (float) $validated['packaging_cost'] + 
                     (float) $validated['delivery_cost'] + 
                     (float) $validated['others_cost'];

        // Update or create calculator
        MenuItemCalculator::updateOrCreate(
            ['menu_item_id' => $menuItemId],
            [
                'ingredients' => $validated['ingredients'],
                'packaging_cost' => $validated['packaging_cost'],
                'delivery_cost' => $validated['delivery_cost'],
                'others_cost' => $validated['others_cost'],
                'total_cost' => $totalCost,
            ]
        );

        return redirect()->route('admin.menu-item-calculator.show', $menuItemId)
            ->with('message', 'Calculator data saved successfully!');
    }

    public function destroy($menuItemId)
    {
        $calculator = MenuItemCalculator::where('menu_item_id', $menuItemId)->first();
        
        if ($calculator) {
            $calculator->delete();
            return redirect()->route('admin.menu-item-calculator.show', $menuItemId)
                ->with('message', 'Calculator data deleted successfully!');
        }

        return redirect()->route('admin.menu-item-calculator.show', $menuItemId);
    }
}

