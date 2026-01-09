<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CateringRequest;
use App\Models\Order;
use App\Models\Subscription;
use App\Models\SubscriptionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'pending_orders' => Order::where('status', 'pending')->count(),
            'pending_catering' => CateringRequest::where('status', 'pending')->count(),
            'pending_subscription_requests' => SubscriptionRequest::where('status', 'pending')->count(),
            'active_subscriptions' => Subscription::where('status', 'active')->count(),
            'today_orders' => Order::whereDate('created_at', today())->count(),
        ];

        $recentOrders = Order::with(['city', 'orderItems.menuItem'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'daily_order_number' => $this->getDailyOrderNumber($order),
                    'customer_name' => $order->customer_name,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'city' => $order->city ? [
                        'id' => $order->city->id,
                        'name' => $order->city->name,
                    ] : null,
                    'orderItems' => $order->orderItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'menuItem' => $item->menuItem ? [
                                'id' => $item->menuItem->id,
                                'name' => $item->menuItem->name,
                            ] : null,
                        ];
                    }),
                ];
            });

        $recentCatering = CateringRequest::latest()
            ->limit(10)
            ->get();

        $recentSubscriptionRequests = SubscriptionRequest::latest()
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentCatering' => $recentCatering,
            'recentSubscriptionRequests' => $recentSubscriptionRequests,
        ]);
    }

    public function qrCode()
    {
        return Inertia::render('Admin/QRCode', [
            'websiteUrl' => 'https://www.spiceloop.com',
            'contactSubscriptionUrl' => 'https://spiceloop.com/contact-subscription',
        ]);
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
