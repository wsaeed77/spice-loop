<?php

namespace App\Http\Controllers;

use App\Models\SpecialOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpecialOrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:255',
            'customer_address' => 'nullable|string',
            'special_instructions' => 'nullable|string',
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        SpecialOrder::create($validated);

        return redirect()->route('menu')->with('message', 'Your special order has been submitted successfully! We will contact you soon to confirm the details.');
    }
}

