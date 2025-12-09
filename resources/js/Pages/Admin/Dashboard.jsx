import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function AdminDashboard({ auth, stats, recentOrders, recentCatering, recentSubscriptionRequests }) {
    return (
        <Layout auth={auth}>
            <Head title="Admin Dashboard - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-spice-maroon mb-8">Admin Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Pending Orders</h3>
                        <p className="text-3xl font-bold text-spice-maroon">{stats.pending_orders}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Pending Catering</h3>
                        <p className="text-3xl font-bold text-spice-maroon">{stats.pending_catering}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Pending Subscription Requests</h3>
                        <p className="text-3xl font-bold text-spice-maroon">{stats.pending_subscription_requests || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Active Subscriptions</h3>
                        <p className="text-3xl font-bold text-spice-maroon">{stats.active_subscriptions}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Today's Orders</h3>
                        <p className="text-3xl font-bold text-spice-maroon">{stats.today_orders}</p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Link href="/admin/menu" className="bg-white rounded-lg shadow-md p-6 border border-spice-orange hover:border-spice-gold transition">
                        <h3 className="text-xl font-bold text-spice-maroon mb-2">Manage Menu</h3>
                        <p className="text-gray-600">Add, edit, or remove menu items</p>
                    </Link>
                    <Link href="/admin/orders" className="bg-white rounded-lg shadow-md p-6 border border-spice-orange hover:border-spice-gold transition">
                        <h3 className="text-xl font-bold text-spice-maroon mb-2">Manage Orders</h3>
                        <p className="text-gray-600">View and update order status</p>
                    </Link>
                    <Link href="/admin/weekly-menu" className="bg-white rounded-lg shadow-md p-6 border border-spice-orange hover:border-spice-gold transition">
                        <h3 className="text-xl font-bold text-spice-maroon mb-2">Weekly Menu</h3>
                        <p className="text-gray-600">Set weekly subscription menu</p>
                    </Link>
                    <Link href="/admin/settings" className="bg-white rounded-lg shadow-md p-6 border border-spice-orange hover:border-spice-gold transition">
                        <h3 className="text-xl font-bold text-spice-maroon mb-2">Settings</h3>
                        <p className="text-gray-600">Configure pricing and contact info</p>
                    </Link>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-spice-maroon">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-spice-orange hover:text-spice-maroon">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Order ID</th>
                                    <th className="text-left py-2">Customer</th>
                                    <th className="text-left py-2">Amount</th>
                                    <th className="text-left py-2">Status</th>
                                    <th className="text-left py-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders?.map((order) => (
                                    <tr key={order.id} className="border-b">
                                        <td className="py-2">#{order.id}</td>
                                        <td className="py-2">{order.customer_name}</td>
                                        <td className="py-2">£{order.total_amount}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-1 rounded text-sm ${
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Catering */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-spice-maroon">Recent Catering Requests</h2>
                        <Link href="/admin/catering" className="text-spice-orange hover:text-spice-maroon">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {recentCatering?.map((request) => (
                            <div key={request.id} className="border-b pb-4 last:border-0">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-semibold">{request.name}</p>
                                        <p className="text-sm text-gray-600">{request.event_type} - {new Date(request.event_date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Subscription Requests */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-spice-maroon">Recent Subscription Requests</h2>
                        <Link href="/admin/subscription-requests" className="text-spice-orange hover:text-spice-maroon">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {recentSubscriptionRequests?.map((request) => (
                            <div key={request.id} className="border-b pb-4 last:border-0">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-semibold">{request.name}</p>
                                        <p className="text-sm text-gray-600">{request.email} - {request.city}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!recentSubscriptionRequests || recentSubscriptionRequests.length === 0) && (
                            <p className="text-gray-500 text-center py-4">No subscription requests yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

