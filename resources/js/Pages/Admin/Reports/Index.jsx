import { Head, Link, router, useForm } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function ReportsIndex({ 
    auth, 
    todayRevenue, 
    todayOrders,
    yesterdayRevenue, 
    yesterdayOrders,
    dateRangeRevenue, 
    dateRangeOrders,
    startDate, 
    endDate,
    topItemsByQuantity,
    topItemsByRevenue,
    dailyRevenue,
    flash 
}) {
    const { data, setData, processing } = useForm({
        start_date: startDate || new Date().toISOString().split('T')[0],
        end_date: endDate || new Date().toISOString().split('T')[0],
    });

    const handleDateRangeChange = (e) => {
        e.preventDefault();
        router.get('/admin/reports', {
            start_date: data.start_date,
            end_date: data.end_date,
        }, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-GB').format(num);
    };

    return (
        <Layout auth={auth}>
            <Head title="Reports Dashboard - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Reports Dashboard</h1>
                    <Link
                        href="/admin/dashboard"
                        className="text-spice-orange hover:text-spice-maroon"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                {/* Date Range Selector */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange mb-8">
                    <h2 className="text-2xl font-bold text-spice-maroon mb-4">Select Date Range</h2>
                    <form onSubmit={handleDateRangeChange} className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="start_date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                required
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="end_date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold transition disabled:opacity-50"
                            >
                                {processing ? 'Loading...' : 'Apply Filter'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Revenue Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Today's Revenue */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Today's Revenue</h3>
                        <p className="text-3xl font-bold text-spice-maroon">{formatCurrency(todayRevenue)}</p>
                        <p className="text-sm text-gray-600 mt-2">{formatNumber(todayOrders)} order{todayOrders !== 1 ? 's' : ''}</p>
                    </div>

                    {/* Yesterday's Revenue */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Yesterday's Revenue</h3>
                        <p className="text-3xl font-bold text-spice-maroon">{formatCurrency(yesterdayRevenue)}</p>
                        <p className="text-sm text-gray-600 mt-2">{formatNumber(yesterdayOrders)} order{yesterdayOrders !== 1 ? 's' : ''}</p>
                    </div>

                    {/* Date Range Revenue */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Date Range Revenue</h3>
                        <p className="text-3xl font-bold text-spice-maroon">{formatCurrency(dateRangeRevenue)}</p>
                        <p className="text-sm text-gray-600 mt-2">{formatNumber(dateRangeOrders)} order{dateRangeOrders !== 1 ? 's' : ''}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(startDate).toLocaleDateString('en-GB')} - {new Date(endDate).toLocaleDateString('en-GB')}
                        </p>
                    </div>
                </div>

                {/* Top Items by Quantity */}
                <div className="bg-white rounded-lg shadow-md border border-spice-orange mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-spice-maroon">Top Items by Quantity</h2>
                        <p className="text-sm text-gray-600 mt-1">Most sold items for selected date range</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-spice-cream">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Total Revenue</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Avg Price</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {topItemsByQuantity && topItemsByQuantity.length > 0 ? (
                                    topItemsByQuantity.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                {item.is_custom && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                                        Custom Item
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                {formatNumber(item.quantity)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                                                {formatCurrency(item.revenue)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                {formatCurrency(item.average_price)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            No items found for the selected date range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Items by Revenue */}
                <div className="bg-white rounded-lg shadow-md border border-spice-orange mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-spice-maroon">Top Items by Revenue</h2>
                        <p className="text-sm text-gray-600 mt-1">Highest revenue generating items for selected date range</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-spice-cream">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Total Revenue</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Avg Price</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {topItemsByRevenue && topItemsByRevenue.length > 0 ? (
                                    topItemsByRevenue.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                {item.is_custom && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                                        Custom Item
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                {formatNumber(item.quantity)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                                                {formatCurrency(item.revenue)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                {formatCurrency(item.average_price)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            No items found for the selected date range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Daily Revenue Breakdown (if range is <= 30 days) */}
                {dailyRevenue && dailyRevenue.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md border border-spice-orange mb-8">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-spice-maroon">Daily Revenue Breakdown</h2>
                            <p className="text-sm text-gray-600 mt-1">Revenue and orders by day</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-spice-cream">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Revenue</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Orders</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Avg Order Value</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dailyRevenue.map((day, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{day.date_formatted}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                                                {formatCurrency(day.revenue)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                {formatNumber(day.order_count)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                {day.order_count > 0 ? formatCurrency(day.revenue / day.order_count) : formatCurrency(0)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

