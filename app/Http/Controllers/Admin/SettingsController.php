<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = [
            'weekly_menu_price' => Setting::get('weekly_menu_price', '50.00'),
            'contact_phone' => Setting::get('contact_phone', ''),
            'whatsapp_number' => Setting::get('whatsapp_number', ''),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'weekly_menu_price' => 'required|numeric|min:0',
            'contact_phone' => 'nullable|string|max:255',
            'whatsapp_number' => 'nullable|string|max:255',
        ]);

        Setting::set('weekly_menu_price', $validated['weekly_menu_price']);
        Setting::set('contact_phone', $validated['contact_phone'] ?? '');
        Setting::set('whatsapp_number', $validated['whatsapp_number'] ?? '');

        return redirect()->route('admin.settings.index')->with('message', 'Settings updated successfully!');
    }
}
