<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SpecialOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpecialOrderController extends Controller
{
    public function index()
    {
        $specialOrders = SpecialOrder::with('menuItem')
            ->latest()
            ->get();

        return Inertia::render('Admin/SpecialOrders/Index', [
            'specialOrders' => $specialOrders,
        ]);
    }

    public function show($id)
    {
        $specialOrder = SpecialOrder::with('menuItem')->findOrFail($id);

        return Inertia::render('Admin/SpecialOrders/Show', [
            'specialOrder' => [
                'id' => $specialOrder->id,
                'menu_item' => $specialOrder->menuItem,
                'customer_name' => $specialOrder->customer_name,
                'customer_email' => $specialOrder->customer_email,
                'customer_phone' => $specialOrder->customer_phone,
                'customer_address' => $specialOrder->customer_address,
                'special_instructions' => $specialOrder->special_instructions,
                'quantity' => $specialOrder->quantity,
                'status' => $specialOrder->status,
                'admin_notes' => $specialOrder->admin_notes,
                'created_at' => $specialOrder->created_at,
                'updated_at' => $specialOrder->updated_at,
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,ready,completed,cancelled',
            'admin_notes' => 'nullable|string',
        ]);

        $specialOrder = SpecialOrder::findOrFail($id);
        $specialOrder->update($validated);

        return redirect()->route('admin.special-orders.show', $id)->with('message', 'Special order status updated successfully!');
    }
}

