<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['city', 'orderItems.menuItem', 'user'])
            ->latest()
            ->paginate(20);

        // Transform paginated data to include daily order numbers
        $orders->getCollection()->transform(function ($order) {
            $order->daily_order_number = $this->getDailyOrderNumber($order);
            return $order;
        });

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function create()
    {
        $cities = City::where('is_active', true)->orderBy('name')->get();
        $menuItems = MenuItem::where('is_available', true)
            ->with('options')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Orders/Create', [
            'cities' => $cities,
            'menuItems' => $menuItems,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string',
            'customer_postcode' => 'nullable|string|max:20',
            'delivery_date' => 'required|date|after_or_equal:today',
            'delivery_time' => 'required|date_format:H:i',
            'delivery_distance' => 'nullable|numeric|min:0',
            'allergies' => 'nullable|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'nullable|exists:menu_items,id|required_without:items.*.custom_item_name',
            'items.*.custom_item_name' => 'nullable|string|max:255|required_without:items.*.menu_item_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.menu_item_option_id' => 'nullable|exists:menu_item_options,id',
            'items.*.price' => 'required|numeric|min:0',
            'delivery_charge' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Calculate total amount
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                // Check if it's a custom item or regular menu item
                if (!empty($item['custom_item_name'])) {
                    // Custom item - use provided price
                    $price = $item['price'];
                } else {
                    // Regular menu item
                    $menuItem = MenuItem::find($item['menu_item_id']);
                    $price = $menuItem->price;
                    
                    // If option is selected, use option price
                    if (!empty($item['menu_item_option_id'])) {
                        $option = $menuItem->options()->find($item['menu_item_option_id']);
                        if ($option) {
                            $price = $option->price;
                        }
                    }
                }
                
                $totalAmount += $price * $item['quantity'];
            }

            $deliveryCharge = $validated['delivery_charge'] ?? 0;
            $totalAmount += $deliveryCharge;

            // Create order
            $order = Order::create([
                'city_id' => $validated['city_id'],
                'customer_name' => $validated['customer_name'],
                'customer_email' => !empty($validated['customer_email']) ? $validated['customer_email'] : null,
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'customer_postcode' => !empty($validated['customer_postcode']) ? $validated['customer_postcode'] : null,
                'delivery_date' => $validated['delivery_date'],
                'delivery_time' => $validated['delivery_time'],
                'delivery_distance' => !empty($validated['delivery_distance']) ? $validated['delivery_distance'] : null,
                'allergies' => !empty($validated['allergies']) ? $validated['allergies'] : null,
                'notes' => !empty($validated['notes']) ? $validated['notes'] : null,
                'total_amount' => $totalAmount,
                'delivery_charge' => $deliveryCharge,
                'status' => 'pending',
            ]);

            // Create order items
            foreach ($validated['items'] as $item) {
                // Check if it's a custom item or regular menu item
                if (!empty($item['custom_item_name'])) {
                    // Custom item - use provided price and name
                    $price = $item['price'];
                    OrderItem::create([
                        'order_id' => $order->id,
                        'menu_item_id' => null,
                        'menu_item_option_id' => null,
                        'custom_item_name' => $item['custom_item_name'],
                        'quantity' => $item['quantity'],
                        'price' => $price,
                    ]);
                } else {
                    // Regular menu item
                    $menuItem = MenuItem::find($item['menu_item_id']);
                    $price = $menuItem->price;
                    
                    if (!empty($item['menu_item_option_id'])) {
                        $option = $menuItem->options()->find($item['menu_item_option_id']);
                        if ($option) {
                            $price = $option->price;
                        }
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'menu_item_id' => $item['menu_item_id'],
                        'menu_item_option_id' => $item['menu_item_option_id'] ?? null,
                        'custom_item_name' => null,
                        'quantity' => $item['quantity'],
                        'price' => $price,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.orders.show', $order->id)
                ->with('message', 'Order created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create order: ' . $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $order = Order::with(['city', 'orderItems.menuItem', 'orderItems.menuItem.options', 'user'])->findOrFail($id);
        $cities = City::where('is_active', true)->orderBy('name')->get()->map(function ($city) {
            return [
                'id' => $city->id,
                'name' => $city->name,
            ];
        });
        $menuItems = MenuItem::where('is_available', true)
            ->with('options')
            ->orderBy('name')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => $item->price,
                    'options' => $item->options ? $item->options->map(function ($opt) {
                        return [
                            'id' => $opt->id,
                            'name' => $opt->name,
                            'price' => $opt->price,
                        ];
                    }) : [],
                ];
            });

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'daily_order_number' => $this->getDailyOrderNumber($order),
                'user_id' => $order->user_id,
                'city_id' => $order->city_id,
                'total_amount' => $order->total_amount,
                'delivery_charge' => $order->delivery_charge,
                'status' => $order->status,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_phone' => $order->customer_phone,
                'customer_address' => $order->customer_address,
                'customer_postcode' => $order->customer_postcode,
                'delivery_date' => $order->delivery_date ? (is_string($order->delivery_date) ? $order->delivery_date : $order->delivery_date->format('Y-m-d')) : null,
                'delivery_time' => $order->delivery_time ? (is_string($order->delivery_time) ? substr($order->delivery_time, 0, 5) : $order->delivery_time->format('H:i')) : null,
                'delivery_distance' => $order->delivery_distance,
                'allergies' => $order->allergies,
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
                        'menu_item_id' => $item->menu_item_id,
                        'menu_item_option_id' => $item->menu_item_option_id,
                        'custom_item_name' => $item->custom_item_name,
                        'is_custom' => !empty($item->custom_item_name),
                        'menuItem' => $item->menuItem ? [
                            'id' => $item->menuItem->id,
                            'name' => $item->menuItem->name,
                            'price' => $item->menuItem->price,
                            'options' => $item->menuItem->options ? $item->menuItem->options->map(function ($opt) {
                                return [
                                    'id' => $opt->id,
                                    'name' => $opt->name,
                                    'price' => $opt->price,
                                ];
                            }) : [],
                        ] : null,
                    ];
                }),
            ],
            'cities' => $cities,
            'menuItems' => $menuItems,
        ]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'city_id' => 'sometimes|required|exists:cities,id',
            'customer_name' => 'sometimes|required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'sometimes|required|string|max:20',
            'customer_address' => 'sometimes|required|string',
            'customer_postcode' => 'nullable|string|max:20',
            'delivery_date' => 'sometimes|required|date',
            'delivery_time' => 'sometimes|required|date_format:H:i',
            'delivery_distance' => 'nullable|numeric|min:0',
            'allergies' => 'nullable|string',
            'notes' => 'nullable|string',
            'delivery_charge' => 'nullable|numeric|min:0',
        ]);

        $order->update($validated);

        // Recalculate total if items changed
        if ($request->has('recalculate_total')) {
            $totalAmount = $order->orderItems->sum(function ($item) {
                return $item->price * $item->quantity;
            });
            $totalAmount += $order->delivery_charge ?? 0;
            $order->update(['total_amount' => $totalAmount]);
        }

        return redirect()->back()->with('message', 'Order updated successfully!');
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,In Queue,confirmed,preparing,ready,out for delivery,delivered,cancelled',
        ]);

        $order->update($validated);

        return redirect()->back()->with('message', 'Order status updated successfully!');
    }

    public function addMenuItem(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'menu_item_id' => 'nullable|exists:menu_items,id|required_without:custom_item_name',
            'custom_item_name' => 'nullable|string|max:255|required_without:menu_item_id',
            'quantity' => 'required|integer|min:1',
            'menu_item_option_id' => 'nullable|exists:menu_item_options,id',
            'price' => 'nullable|numeric|min:0|required_with:custom_item_name',
        ]);

        // Check if it's a custom item or regular menu item
        if (!empty($validated['custom_item_name'])) {
            // Custom item - use provided price and name
            $price = $validated['price'];
            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => null,
                'menu_item_option_id' => null,
                'custom_item_name' => $validated['custom_item_name'],
                'quantity' => $validated['quantity'],
                'price' => $price,
            ]);
        } else {
            // Regular menu item
            $menuItem = MenuItem::find($validated['menu_item_id']);
            $price = $menuItem->price;

            if (!empty($validated['menu_item_option_id'])) {
                $option = $menuItem->options()->find($validated['menu_item_option_id']);
                if ($option) {
                    $price = $option->price;
                }
            }

            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $validated['menu_item_id'],
                'menu_item_option_id' => $validated['menu_item_option_id'] ?? null,
                'custom_item_name' => null,
                'quantity' => $validated['quantity'],
                'price' => $price,
            ]);
        }

        // Recalculate total
        $totalAmount = $order->orderItems()->sum(DB::raw('price * quantity'));
        $totalAmount += $order->delivery_charge ?? 0;
        $order->update(['total_amount' => $totalAmount]);

        return redirect()->back()->with('message', 'Item added successfully!');
    }

    public function removeMenuItem($orderId, $itemId)
    {
        $order = Order::findOrFail($orderId);
        $orderItem = OrderItem::where('order_id', $orderId)->findOrFail($itemId);

        $orderItem->delete();

        // Recalculate total
        $totalAmount = $order->orderItems()->sum(DB::raw('price * quantity'));
        $totalAmount += $order->delivery_charge ?? 0;
        $order->update(['total_amount' => $totalAmount]);

        return redirect()->back()->with('message', 'Menu item removed successfully!');
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

    /**
     * Calculate daily order number (resets each day)
     */
    private function getDailyOrderNumber($order)
    {
        $orderDate = \Carbon\Carbon::parse($order->created_at)->startOfDay();
        $dailyOrderNumber = Order::whereDate('created_at', $orderDate->format('Y-m-d'))
            ->where(function($query) use ($order) {
                $query->where('created_at', '<', $order->created_at)
                    ->orWhere(function($q) use ($order) {
                        $q->where('created_at', $order->created_at)
                          ->where('id', '<=', $order->id);
                    });
            })
            ->count();
        
        return $dailyOrderNumber;
    }
}
