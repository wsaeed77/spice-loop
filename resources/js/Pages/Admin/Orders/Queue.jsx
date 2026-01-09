import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Layout from '../../../Components/Layout';

export default function OrderQueue({ auth, orders, flash }) {
    const [localOrders, setLocalOrders] = useState(orders || []);
    const [beepPlayed, setBeepPlayed] = useState({});
    const intervalRef = useRef(null);

    // Play beep sound using Web Audio API
    const playBeep = () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (err) {
            console.log('Beep play failed:', err);
        }
    };

    // Check for alerts and play beep
    useEffect(() => {
        const checkAlerts = () => {
            localOrders.forEach(order => {
                const key = `${order.id}-${order.alert_level}`;
                
                // Play beep for critical (20 mins) or warning (1 hour) alerts
                if ((order.alert_level === 'critical' || order.alert_level === 'warning') && !beepPlayed[key]) {
                    playBeep();
                    setBeepPlayed(prev => ({ ...prev, [key]: true }));
                }
            });
        };

        checkAlerts();
        const interval = setInterval(checkAlerts, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [localOrders, beepPlayed]);

    // Auto-refresh every minute
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            router.reload({ only: ['orders'], preserveState: false });
        }, 60000); // 60 seconds = 1 minute

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Update local orders when props change
    useEffect(() => {
        setLocalOrders(orders || []);
    }, [orders]);

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'In Queue': 'bg-blue-100 text-blue-800 border-blue-300',
            'preparing': 'bg-purple-100 text-purple-800 border-purple-300',
            'out for delivery': 'bg-orange-100 text-orange-800 border-orange-300',
            'delivered': 'bg-green-100 text-green-800 border-green-300',
            'cancelled': 'bg-red-100 text-red-800 border-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getAlertClasses = (alertLevel) => {
        if (alertLevel === 'critical') {
            return 'border-4 border-red-500 bg-red-50 animate-pulse';
        } else if (alertLevel === 'warning') {
            return 'border-4 border-orange-500 bg-orange-50';
        } else if (alertLevel === 'info') {
            return 'border-2 border-blue-300 bg-blue-50';
        }
        return '';
    };

    const handleStatusChange = (orderId, newStatus) => {
        router.patch(`/admin/orders/${orderId}/status`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'In Queue', label: 'In Queue' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'out for delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
    ];

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <Layout auth={auth}>
            <Head title="Order Queue - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-spice-maroon mb-2">Order Queue</h1>
                        <Link
                            href="/admin/dashboard"
                            className="text-spice-orange hover:text-spice-maroon"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <Link
                        href="/admin/orders/create"
                        className="bg-spice-orange hover:bg-spice-gold text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        + Create Order
                    </Link>
                </div>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                {localOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md border border-spice-orange p-8 text-center">
                        <p className="text-gray-500 text-lg">No orders in the queue.</p>
                        <Link
                            href="/admin/orders/create"
                            className="text-spice-orange hover:text-spice-maroon mt-4 inline-block"
                        >
                            Create your first order →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {localOrders.map((order) => (
                            <div
                                key={order.id}
                                className={`bg-white rounded-lg shadow-md border p-6 transition-all ${getAlertClasses(order.alert_level)}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-spice-maroon">Order #{order.id}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{order.customer_name}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Delivery Date & Time</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatDate(order.delivery_date)} at {formatTime(order.delivery_time)}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-gray-500">Time Remaining</p>
                                        <p className={`font-bold text-lg ${
                                            order.alert_level === 'critical' ? 'text-red-600' :
                                            order.alert_level === 'warning' ? 'text-orange-600' :
                                            'text-gray-900'
                                        }`}>
                                            {order.formatted_time_remaining || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-semibold text-gray-900">{order.customer_phone}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="font-semibold text-gray-900">
                                            {order.customer_address}
                                            {order.customer_postcode && `, ${order.customer_postcode}`}
                                        </p>
                                    </div>

                                    {order.city && (
                                        <div>
                                            <p className="text-sm text-gray-500">City</p>
                                            <p className="font-semibold text-gray-900">{order.city.name}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm text-gray-500">Total</p>
                                        <p className="font-semibold text-gray-900">£{parseFloat(order.total_amount).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-2">Items</p>
                                    <div className="space-y-1">
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                            order.orderItems.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span className="text-gray-700">
                                                        {item.menuItem?.name || 'Unknown'} × {item.quantity}
                                                    </span>
                                                    <span className="text-gray-900 font-semibold">
                                                        £{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No items</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Update Status
                                    </label>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-spice-orange focus:border-spice-orange"
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="mt-3 block text-center text-spice-orange hover:text-spice-maroon text-sm font-semibold"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

