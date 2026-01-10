<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Get date range from request or use defaults
        $startDateInput = $request->input('start_date');
        $endDateInput = $request->input('end_date');
        
        try {
            if ($startDateInput) {
                $startDate = Carbon::parse($startDateInput)->startOfDay();
            } else {
                $startDate = Carbon::today()->startOfDay();
            }
            
            if ($endDateInput) {
                $endDate = Carbon::parse($endDateInput)->endOfDay();
            } else {
                $endDate = Carbon::today()->endOfDay();
            }
        } catch (\Exception $e) {
            $startDate = Carbon::today()->startOfDay();
            $endDate = Carbon::today()->endOfDay();
        }

        // Revenue for today
        $todayRevenue = Order::whereDate('created_at', Carbon::today())
            ->where('status', '!=', 'cancelled')
            ->sum('total_amount');

        // Revenue for yesterday
        $yesterdayRevenue = Order::whereDate('created_at', Carbon::yesterday())
            ->where('status', '!=', 'cancelled')
            ->sum('total_amount');

        // Revenue for date range
        $dateRangeRevenue = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->sum('total_amount');

        // Order counts
        $todayOrders = Order::whereDate('created_at', Carbon::today())
            ->where('status', '!=', 'cancelled')
            ->count();

        $yesterdayOrders = Order::whereDate('created_at', Carbon::yesterday())
            ->where('status', '!=', 'cancelled')
            ->count();

        $dateRangeOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->count();

        // Top items with quantity and revenue for date range
        // Using a query that groups by item name (handling both menu items and custom items)
        $topItemsRaw = DB::table('order_items')
            ->leftJoin('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.status', '!=', 'cancelled')
            ->select(
                DB::raw('COALESCE(menu_items.name, order_items.custom_item_name) as item_name'),
                DB::raw('MAX(CASE WHEN order_items.custom_item_name IS NOT NULL THEN 1 ELSE 0 END) as is_custom'),
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
            )
            ->groupBy(DB::raw('COALESCE(menu_items.name, order_items.custom_item_name)'))
            ->orderByDesc('total_quantity')
            ->limit(20)
            ->get();

        $topItems = $topItemsRaw->map(function ($item) {
            return [
                'name' => $item->item_name ?: 'Unknown Item',
                'is_custom' => (bool)$item->is_custom,
                'quantity' => (int)$item->total_quantity,
                'revenue' => (float)$item->total_revenue,
                'average_price' => $item->total_quantity > 0 ? round($item->total_revenue / $item->total_quantity, 2) : 0,
            ];
        })->values()->all();

        // Top items by revenue
        $topItemsByRevenueRaw = DB::table('order_items')
            ->leftJoin('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.status', '!=', 'cancelled')
            ->select(
                DB::raw('COALESCE(menu_items.name, order_items.custom_item_name) as item_name'),
                DB::raw('MAX(CASE WHEN order_items.custom_item_name IS NOT NULL THEN 1 ELSE 0 END) as is_custom'),
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
            )
            ->groupBy(DB::raw('COALESCE(menu_items.name, order_items.custom_item_name)'))
            ->orderByDesc('total_revenue')
            ->limit(20)
            ->get();

        $topItemsByRevenue = $topItemsByRevenueRaw->map(function ($item) {
            return [
                'name' => $item->item_name ?: 'Unknown Item',
                'is_custom' => (bool)$item->is_custom,
                'quantity' => (int)$item->total_quantity,
                'revenue' => (float)$item->total_revenue,
                'average_price' => $item->total_quantity > 0 ? round($item->total_revenue / $item->total_quantity, 2) : 0,
            ];
        })->values()->all();

        // Daily revenue breakdown for the date range (last 30 days or selected range)
        $daysDiff = $startDate->diffInDays($endDate);
        $maxDays = 30;
        
        if ($daysDiff <= $maxDays) {
            $dailyRevenue = Order::select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('COUNT(*) as order_count')
                )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->where('status', '!=', 'cancelled')
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date')
                ->get()
                ->map(function ($day) {
                    return [
                        'date' => Carbon::parse($day->date)->format('Y-m-d'),
                        'date_formatted' => Carbon::parse($day->date)->format('M d, Y'),
                        'revenue' => (float)$day->revenue,
                        'order_count' => (int)$day->order_count,
                    ];
                });
        } else {
            $dailyRevenue = collect([]);
        }

        return Inertia::render('Admin/Reports/Index', [
            'todayRevenue' => round($todayRevenue, 2),
            'todayOrders' => $todayOrders,
            'yesterdayRevenue' => round($yesterdayRevenue, 2),
            'yesterdayOrders' => $yesterdayOrders,
            'dateRangeRevenue' => round($dateRangeRevenue, 2),
            'dateRangeOrders' => $dateRangeOrders,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
            'topItemsByQuantity' => $topItems,
            'topItemsByRevenue' => $topItemsByRevenue,
            'dailyRevenue' => $dailyRevenue,
        ]);
    }
}

