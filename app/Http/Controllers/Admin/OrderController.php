<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['city', 'orderItems.menuItem', 'user'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show($id)
    {
        $order = Order::with(['city', 'orderItems.menuItem', 'user'])->findOrFail($id);

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'user_id' => $order->user_id,
                'city_id' => $order->city_id,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_phone' => $order->customer_phone,
                'customer_address' => $order->customer_address,
                'notes' => $order->notes,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'city' => $order->city ? [
                    'id' => $order->city->id,
                    'name' => $order->city->name,
                ] : null,
                'user' => $order->user ? [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'email' => $order->user->email,
                ] : null,
                'orderItems' => $order->orderItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'menuItem' => $item->menuItem ? [
                            'id' => $item->menuItem->id,
                            'name' => $item->menuItem->name,
                            'price' => $item->menuItem->price,
                        ] : null,
                    ];
                }),
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,ready,delivered,cancelled',
        ]);

        $order->update($validated);

        return redirect()->back()->with('message', 'Order status updated successfully!');
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $orderId = $order->id;
        
        // Order items will be deleted automatically due to cascade
        $order->delete();

        return redirect()->route('admin.orders.index')
            ->with('message', "Order #{$orderId} has been deleted successfully!");
    }
}
