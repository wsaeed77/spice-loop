import { Head, Link, router, useForm } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function OrderShow({ auth, order, flash }) {
    const { data, setData, patch, processing } = useForm({
        status: order?.status || 'pending',
    });

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        patch(`/admin/orders/${order.id}/status`, {
            preserveScroll: true,
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-purple-100 text-purple-800',
            ready: 'bg-green-100 text-green-800',
            delivered: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'ready', label: 'Ready' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    if (!order) {
        return (
            <Layout auth={auth}>
                <Head title="Order Not Found - SpiceLoop" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-gray-500">Order not found.</p>
                    <Link href="/admin/orders" className="text-spice-orange hover:text-spice-maroon">
                        ← Back to Orders
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout auth={auth}>
            <Head title={`Order #${order.id} - SpiceLoop`} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Order #{order.id}</h1>
                    <Link
                        href="/admin/orders"
                        className="text-spice-orange hover:text-spice-maroon"
                    >
                        ← Back to Orders
                    </Link>
                </div>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Order Items</h2>
                            {order.orderItems && order.orderItems.length > 0 ? (
                                <div className="space-y-4">
                                    {order.orderItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {item.menuItem?.name || 'Unknown Item'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Quantity: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                ${(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-spice-orange">
                                        <p className="text-xl font-bold text-spice-maroon">Total</p>
                                        <p className="text-xl font-bold text-spice-maroon">
                                            ${parseFloat(order.total_amount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No items in this order.</p>
                            )}
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Customer Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold text-gray-900">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">{order.customer_email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-semibold text-gray-900">{order.customer_phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-semibold text-gray-900">{order.customer_address}</p>
                                </div>
                                {order.city && (
                                    <div>
                                        <p className="text-sm text-gray-500">City</p>
                                        <p className="font-semibold text-gray-900">{order.city.name}</p>
                                    </div>
                                )}
                                {order.notes && (
                                    <div>
                                        <p className="text-sm text-gray-500">Notes</p>
                                        <p className="font-semibold text-gray-900">{order.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Status & Actions */}
                    <div className="space-y-6">
                        {/* Status Update */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Order Status</h2>
                            <form onSubmit={handleStatusUpdate} className="space-y-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold transition disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Status'}
                                </button>
                            </form>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Current Status:</p>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Order Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-semibold text-gray-900">#{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-semibold text-gray-900">{formatDate(order.created_at)}</p>
                                </div>
                                {order.user && (
                                    <div>
                                        <p className="text-sm text-gray-500">User Account</p>
                                        <p className="font-semibold text-gray-900">
                                            {order.user.name} ({order.user.email})
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

