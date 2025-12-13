import { Head, Link } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function SpecialOrdersIndex({ auth, specialOrders, flash }) {
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-purple-100 text-purple-800',
            ready: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || colors.pending;
    };

    const getStatusLabel = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <Layout auth={auth}>
            <Head title="Special Orders - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon">Special Orders</h1>
                    <Link
                        href={route('admin.dashboard')}
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

                <div className="bg-white rounded-lg shadow-md border border-spice-orange overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-spice-cream">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {specialOrders && specialOrders.length > 0 ? (
                                    specialOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{order.menu_item?.name || 'N/A'}</div>
                                                {order.special_instructions && (
                                                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                                        {order.special_instructions}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{order.customer_name}</div>
                                                <div className="text-sm text-gray-500">{order.customer_email}</div>
                                                <div className="text-sm text-gray-500">{order.customer_phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{order.quantity}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(order.created_at).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    href={route('admin.special-orders.show', order.id)}
                                                    className="text-spice-orange hover:text-spice-maroon"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No special orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

