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
            ->get();

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
        ]);
    }
}
