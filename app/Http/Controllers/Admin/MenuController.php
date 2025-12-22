<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\MenuItemOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'dish_type' => 'nullable|in:Veg,Meat',
            'is_available' => 'boolean',
            'is_available_today' => 'boolean',
            'is_subscription_item' => 'boolean',
            'is_featured' => 'boolean',
            'is_weekend_special' => 'boolean',
            'options' => 'nullable|array',
            'options.*.name' => 'required_with:options|string|max:255',
            'options.*.price' => 'required_with:options|numeric|min:0',
        ]);

        // Handle file upload
        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('menu-items', 'public');
            $validated['image'] = Storage::url($imagePath);
        }

        // Remove image_file from validated data as it's not a database field
        unset($validated['image_file']);

        // Handle options if type is 'halwa puri'
        $options = $validated['options'] ?? [];
        unset($validated['options']);

        $menuItem = MenuItem::create($validated);

        // Create options if provided
        if (!empty($options)) {
            foreach ($options as $index => $option) {
                if (!empty($option['name']) && isset($option['price'])) {
                    MenuItemOption::create([
                        'menu_item_id' => $menuItem->id,
                        'name' => $option['name'],
                        'price' => $option['price'],
                        'sort_order' => $index,
                    ]);
                }
            }
        }

        return redirect()->route('admin.menu.index')->with('message', 'Menu item created successfully!');
    }

    public function edit($id)
    {
        $menuItem = MenuItem::with('options')->findOrFail($id);
        
        return Inertia::render('Admin/Menu/Edit', [
            'menuItem' => [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
                'description' => $menuItem->description,
                'price' => (string) $menuItem->price,
                'image' => $menuItem->image,
                'category' => $menuItem->category,
                'type' => $menuItem->type,
                'dish_type' => $menuItem->dish_type,
                'is_available' => (bool) $menuItem->is_available,
                'is_available_today' => (bool) ($menuItem->is_available_today ?? true),
                'is_subscription_item' => (bool) $menuItem->is_subscription_item,
                'is_featured' => (bool) $menuItem->is_featured,
                'is_weekend_special' => (bool) $menuItem->is_weekend_special,
                'options' => $menuItem->options->map(function ($option) {
                    return [
                        'id' => $option->id,
                        'name' => $option->name,
                        'price' => (string) $option->price,
                    ];
                }),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $menuItem = MenuItem::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'dish_type' => 'nullable|in:Veg,Meat',
            'is_available' => 'boolean',
            'is_available_today' => 'boolean',
            'is_subscription_item' => 'boolean',
            'is_featured' => 'boolean',
            'is_weekend_special' => 'boolean',
            'options' => 'nullable|array',
            'options.*.name' => 'required_with:options|string|max:255',
            'options.*.price' => 'required_with:options|numeric|min:0',
        ]);

        // Handle file upload
        if ($request->hasFile('image_file')) {
            // Delete old image if it exists and is stored locally
            if ($menuItem->image && strpos($menuItem->image, '/storage/') !== false) {
                $oldPath = str_replace('/storage/', '', $menuItem->image);
                Storage::disk('public')->delete($oldPath);
            }

            // Store new image
            $imagePath = $request->file('image_file')->store('menu-items', 'public');
            $validated['image'] = Storage::url($imagePath);
        }
        // If no new file is uploaded, keep the existing image (don't update the image field)

        // Remove image_file from validated data as it's not a database field
        unset($validated['image_file']);

        // Handle options if type is 'halwa puri'
        $options = $validated['options'] ?? [];
        unset($validated['options']);

        $menuItem->update($validated);

        // Sync options for any menu item
        // Delete existing options
        $menuItem->options()->delete();
        
        // Create new options if provided
        if (!empty($options)) {
            foreach ($options as $index => $option) {
                if (!empty($option['name']) && isset($option['price'])) {
                    MenuItemOption::create([
                        'menu_item_id' => $menuItem->id,
                        'name' => $option['name'],
                        'price' => $option['price'],
                        'sort_order' => $index,
                    ]);
                }
            }
        }

        return redirect()->route('admin.menu.index')->with('message', 'Menu item updated successfully!');
    }

    public function destroy($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->delete();

        return redirect()->route('admin.menu.index')->with('message', 'Menu item deleted successfully!');
    }
}
