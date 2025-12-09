<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
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
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category' => 'nullable|string|max:255',
            'is_available' => 'boolean',
            'is_subscription_item' => 'boolean',
        ]);

        // Handle file upload
        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('menu-items', 'public');
            $validated['image'] = Storage::url($imagePath);
        }

        // Remove image_file from validated data as it's not a database field
        unset($validated['image_file']);

        MenuItem::create($validated);

        return redirect()->route('admin.menu.index')->with('message', 'Menu item created successfully!');
    }

    public function edit($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        
        return Inertia::render('Admin/Menu/Edit', [
            'menuItem' => [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
                'description' => $menuItem->description,
                'price' => (string) $menuItem->price,
                'image' => $menuItem->image,
                'category' => $menuItem->category,
                'is_available' => (bool) $menuItem->is_available,
                'is_subscription_item' => (bool) $menuItem->is_subscription_item,
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
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category' => 'nullable|string|max:255',
            'is_available' => 'boolean',
            'is_subscription_item' => 'boolean',
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

        // Remove image_file from validated data as it's not a database field
        unset($validated['image_file']);

        $menuItem->update($validated);

        return redirect()->route('admin.menu.index')->with('message', 'Menu item updated successfully!');
    }

    public function destroy($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->delete();

        return redirect()->route('admin.menu.index')->with('message', 'Menu item deleted successfully!');
    }
}
