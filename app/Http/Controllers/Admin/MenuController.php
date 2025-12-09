<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $menuItems = MenuItem::latest()->get();

        return Inertia::render('Admin/Menu/Index', [
            'menuItems' => $menuItems,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Menu/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'is_available' => 'boolean',
            'is_subscription_item' => 'boolean',
        ]);

        MenuItem::create($validated);

        return redirect()->route('admin.menu.index')->with('message', 'Menu item created successfully!');
    }

    public function edit(MenuItem $menuItem)
    {
        return Inertia::render('Admin/Menu/Edit', [
            'menuItem' => $menuItem,
        ]);
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'is_available' => 'boolean',
            'is_subscription_item' => 'boolean',
        ]);

        $menuItem->update($validated);

        return redirect()->route('admin.menu.index')->with('message', 'Menu item updated successfully!');
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();

        return redirect()->route('admin.menu.index')->with('message', 'Menu item deleted successfully!');
    }
}
