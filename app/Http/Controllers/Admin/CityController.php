<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CityController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index()
    {
        $cities = City::latest()->get();

        return Inertia::render('Admin/Cities/Index', [
            'cities' => $cities,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:cities,name',
            'is_active' => 'boolean',
        ]);

        City::create($validated);

        return redirect()->route('admin.cities.index')->with('message', 'City created successfully!');
    }

    public function update(Request $request, City $city)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:cities,name,' . $city->id,
            'is_active' => 'boolean',
        ]);

        $city->update($validated);

        return redirect()->route('admin.cities.index')->with('message', 'City updated successfully!');
    }

    public function destroy(City $city)
    {
        $city->delete();

        return redirect()->route('admin.cities.index')->with('message', 'City deleted successfully!');
    }
}
