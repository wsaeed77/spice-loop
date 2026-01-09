<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderQueueController extends Controller
{
    public function index()
    {
        // Get orders that are not delivered or cancelled
        $orders = Order::with(['city', 'orderItems.menuItem', 'user'])
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
                    'city' => $order->city ? [
                        'id' => $order->city->id,
                        'name' => $order->city->name,
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
                    'created_at' => $order->created_at,
                ];
            })
            ->filter(); // Remove null entries

        return Inertia::render('Admin/Orders/Queue', [
            'orders' => $orders->values(), // Re-index array after filtering
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
}

