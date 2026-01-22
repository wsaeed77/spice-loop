<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryRider;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderQueueController extends Controller
{
    public function index()
    {
        // Get orders that are not delivered or cancelled
        $orders = Order::with(['city', 'orderItems.menuItem', 'user', 'rider'])
            ->whereIn('status', ['pending', 'In Queue', 'preparing', 'out for delivery'])
            ->whereNotNull('delivery_date')
            ->whereNotNull('delivery_time')
            ->orderBy('delivery_date')
            ->orderBy('delivery_time')
            ->get()
            ->map(function ($order) {
                if (!$order->delivery_date || !$order->delivery_time) {
                    return null;
                }
                
                // Calculate daily order number (resets each day)
                $dailyOrderNumber = $this->getDailyOrderNumber($order);
                
                // delivery_time is stored as TIME (HH:MM:SS), so it's returned as string
                $deliveryTime = is_string($order->delivery_time) ? substr($order->delivery_time, 0, 5) : $order->delivery_time->format('H:i');
                $deliveryDateTime = Carbon::parse($order->delivery_date->format('Y-m-d') . ' ' . $deliveryTime);
                $now = Carbon::now();
                $minutesRemaining = $now->diffInMinutes($deliveryDateTime, false);
                $hoursRemaining = floor($minutesRemaining / 60); // Whole hours
                $remainingMinutes = $minutesRemaining % 60; // Remaining minutes after hours
                
                // Determine alert level based on total minutes
                $alertLevel = null;
                if ($minutesRemaining <= 20) {
                    $alertLevel = 'critical'; // 20 mins or less
                } elseif ($minutesRemaining <= 60) {
                    $alertLevel = 'warning'; // 1 hour or less (60 minutes)
                } elseif ($minutesRemaining <= 180) {
                    $alertLevel = 'info'; // 3 hours or less (180 minutes)
                }

                return [
                    'id' => $order->id,
                    'daily_order_number' => $dailyOrderNumber,
                    'customer_name' => $order->customer_name,
                    'customer_phone' => $order->customer_phone,
                    'customer_address' => $order->customer_address,
                    'customer_postcode' => $order->customer_postcode,
                    'status' => $order->status,
                    'delivery_date' => $order->delivery_date?->format('Y-m-d'),
                    'delivery_time' => is_string($order->delivery_time) ? substr($order->delivery_time, 0, 5) : $order->delivery_time?->format('H:i'),
                    'delivery_datetime' => $deliveryDateTime->toDateTimeString(),
                    'hours_remaining' => $hoursRemaining,
                    'minutes_remaining' => $minutesRemaining,
                    'remaining_minutes' => $remainingMinutes, // Minutes after hours
                    'formatted_time_remaining' => $this->formatTimeRemaining($hoursRemaining, $remainingMinutes),
                    'alert_level' => $alertLevel,
                    'total_amount' => $order->total_amount,
                    'payment_type' => $order->payment_type,
                    'city' => $order->city ? [
                        'id' => $order->city->id,
                        'name' => $order->city->name,
                    ] : null,
                    'rider_id' => $order->rider_id,
                    'rider' => $order->rider ? [
                        'id' => $order->rider->id,
                        'name' => $order->rider->name,
                        'phone' => $order->rider->phone,
                    ] : null,
                    'orderItems' => $order->orderItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'custom_item_name' => $item->custom_item_name,
                            'is_custom' => !empty($item->custom_item_name),
                            'menuItem' => $item->menuItem ? [
                                'id' => $item->menuItem->id,
                                'name' => $item->menuItem->name,
                            ] : null,
                        ];
                    }),
                    'sms_message' => $this->formatSmsMessage($order),
                    'created_at' => $order->created_at,
                ];
            })
            ->filter(); // Remove null entries

        $ordersCollection = $orders->values();
        
        // Find the next order (earliest delivery time that's in the future)
        $nextOrder = null;
        $now = Carbon::now();
        
        foreach ($ordersCollection as $order) {
            $deliveryDateTime = Carbon::parse($order['delivery_datetime']);
            if ($deliveryDateTime->isFuture()) {
                $nextOrder = $order;
                break;
            }
        }
        
        // Calculate next order info
        $nextOrderInfo = null;
        if ($nextOrder) {
            $nextDeliveryDateTime = Carbon::parse($nextOrder['delivery_datetime']);
            $minutesRemaining = $now->diffInMinutes($nextDeliveryDateTime, false);
            $hoursRemaining = floor($minutesRemaining / 60);
            $remainingMinutes = $minutesRemaining % 60;
            
            $nextOrderInfo = [
                'order_number' => $nextOrder['daily_order_number'] ?? $nextOrder['id'],
                'order_id' => $nextOrder['id'],
                'delivery_datetime' => $nextOrder['delivery_datetime'],
                'time_remaining' => $this->formatTimeRemaining($hoursRemaining, $remainingMinutes),
                'raw_minutes_remaining' => $minutesRemaining,
                'hours_remaining' => $hoursRemaining,
                'minutes_remaining' => $remainingMinutes,
            ];
        }

        // Get active riders for assignment
        $riders = DeliveryRider::where('is_active', true)->orderBy('name')->get()->map(function ($rider) {
            return [
                'id' => $rider->id,
                'name' => $rider->name,
                'phone' => $rider->phone,
            ];
        });

        return Inertia::render('Admin/Orders/Queue', [
            'orders' => $ordersCollection,
            'nextOrderInfo' => $nextOrderInfo,
            'riders' => $riders,
        ]);
    }

    private function formatTimeRemaining($hours, $remainingMinutes)
    {
        if ($hours < 0 || $remainingMinutes < 0) {
            return 'Overdue';
        }

        if ($hours > 0) {
            return $hours . 'h ' . $remainingMinutes . 'm';
        }

        return $remainingMinutes . 'm';
    }

    /**
     * Calculate daily order number (resets each day)
     */
    private function getDailyOrderNumber($order)
    {
        $orderDate = Carbon::parse($order->created_at)->startOfDay();
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

    /**
     * Format SMS message for display (same format as sent to rider)
     */
    private function formatSmsMessage($order)
    {
        $deliveryDate = $order->delivery_date ? Carbon::parse($order->delivery_date)->format('d M Y') : 'N/A';
        $deliveryTime = $order->delivery_time ? (is_string($order->delivery_time) ? substr($order->delivery_time, 0, 5) : $order->delivery_time->format('H:i')) : 'N/A';
        
        // Format address with postcode
        $address = $order->customer_address;
        if ($order->customer_postcode) {
            $address .= ', ' . $order->customer_postcode;
        }
        
        // Build message with exact format and spacing as shown in SMS
        $message = "Phone: {$order->customer_phone}\n";
        $message .= "Address: {$address}\n";
        $message .= "Delivery: {$deliveryDate} at {$deliveryTime}\n";
        $message .= "\n";
        $message .= "Total: £" . number_format($order->total_amount, 2) . "\n";
        $message .= "\n";
        $message .= "Items:\n";
        
        // Load order items if not already loaded
        if (!$order->relationLoaded('orderItems')) {
            $order->load('orderItems.menuItem');
        }
        
        foreach ($order->orderItems as $item) {
            $itemName = $item->custom_item_name ? $item->custom_item_name : ($item->menuItem->name ?? 'Unknown Item');
            $itemTotal = $item->price * $item->quantity;
            $message .= "{$itemName} x{$item->quantity} (£" . number_format($itemTotal, 2) . ")\n";
        }
        
        return $message;
    }
}

