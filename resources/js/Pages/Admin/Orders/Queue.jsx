import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Layout from '../../../Components/Layout';

export default function OrderQueue({ auth, orders, flash, nextOrderInfo, riders }) {
    const [localOrders, setLocalOrders] = useState(orders || []);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [beepPlayed, setBeepPlayed] = useState({});
    const [snoozedOrders, setSnoozedOrders] = useState({}); // { orderId: timestamp when snoozed }
    const [snoozeDisplayTime, setSnoozeDisplayTime] = useState(Date.now()); // Force re-render for countdown
    const [assigningRider, setAssigningRider] = useState({}); // { orderId: true/false }
    const intervalRef = useRef(null);
    const beepIntervalRef = useRef(null);
    const snoozeDisplayIntervalRef = useRef(null);

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

    // Check for alerts and play beep every 15 seconds
    useEffect(() => {
        const checkAlerts = () => {
            const now = Date.now();
            
            localOrders.forEach(order => {
                // Only beep for critical (20 mins) or warning (1 hour) alerts
                if (order.alert_level === 'critical' || order.alert_level === 'warning') {
                    // Check if order is snoozed
                    const snoozedAt = snoozedOrders[order.id];
                    if (snoozedAt) {
                        // If snoozed, check if 5 minutes (300000ms) have passed
                        const snoozeDuration = now - snoozedAt;
                        if (snoozeDuration < 300000) {
                            // Still in snooze period, don't beep
                            return;
                        } else {
                            // Snooze period expired, remove from snoozed list
                            setSnoozedOrders(prev => {
                                const updated = { ...prev };
                                delete updated[order.id];
                                return updated;
                            });
                        }
                    }
                    
                    // Play beep if not snoozed or snooze expired
                    playBeep();
                }
            });
        };

        // Check immediately
        checkAlerts();
        
        // Check every 15 seconds
        beepIntervalRef.current = setInterval(checkAlerts, 15000); // 15 seconds

        return () => {
            if (beepIntervalRef.current) {
                clearInterval(beepIntervalRef.current);
            }
        };
    }, [localOrders, snoozedOrders]);

    // Update current time every second for live countdown
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(timeInterval);
    }, []);

    // Auto-refresh every minute (updates orders and nextOrderInfo)
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            router.reload({ only: ['orders', 'nextOrderInfo'], preserveState: false });
        }, 60000); // 60 seconds = 1 minute

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Update current time state when nextOrderInfo changes to trigger recalculation
    useEffect(() => {
        setCurrentTime(Date.now());
    }, [nextOrderInfo]);

    // Calculate real-time next order countdown
    const getNextOrderDisplay = () => {
        if (!nextOrderInfo || !nextOrderInfo.delivery_datetime) {
            return null;
        }
        
        // Calculate current time remaining based on current time
        const now = new Date(currentTime);
        const nextOrderDateTime = new Date(nextOrderInfo.delivery_datetime);
        
        if (isNaN(nextOrderDateTime.getTime())) {
            return nextOrderInfo.time_remaining; // Fallback to server-calculated time
        }
        
        const diffMs = nextOrderDateTime - now;
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;
        
        if (diffMinutes < 0) {
            return 'Overdue';
        }
        
        if (diffHours > 0) {
            return `${diffHours}h ${remainingMinutes}m`;
        }
        
        return `${remainingMinutes}m`;
    };

    // Get current minutes remaining for styling
    const getCurrentMinutesRemaining = () => {
        if (!nextOrderInfo || !nextOrderInfo.delivery_datetime) {
            return 0;
        }
        
        const now = new Date(currentTime);
        const nextOrderDateTime = new Date(nextOrderInfo.delivery_datetime);
        
        if (isNaN(nextOrderDateTime.getTime())) {
            return nextOrderInfo.raw_minutes_remaining || 0;
        }
        
        const diffMs = nextOrderDateTime - now;
        return Math.floor(diffMs / 60000);
    };

    // Update local orders when props change and clean up snoozed orders
    useEffect(() => {
        setLocalOrders(orders || []);
        
        // Clean up snoozed orders for orders that no longer exist or no longer need alerting
        if (orders && orders.length > 0) {
            setSnoozedOrders(prev => {
                const updated = { ...prev };
                const orderIds = orders.map(o => o.id);
                
                // Remove snoozed entries for orders that no longer exist or don't need alerting
                Object.keys(updated).forEach(orderId => {
                    const order = orders.find(o => o.id == orderId);
                    if (!order || (order.alert_level !== 'critical' && order.alert_level !== 'warning')) {
                        delete updated[orderId];
                    }
                });
                
                return updated;
            });
        }
    }, [orders]);

    // Update snooze display timer every second for countdown
    useEffect(() => {
        snoozeDisplayIntervalRef.current = setInterval(() => {
            setSnoozeDisplayTime(Date.now());
        }, 1000); // Update every second

        return () => {
            if (snoozeDisplayIntervalRef.current) {
                clearInterval(snoozeDisplayIntervalRef.current);
            }
        };
    }, []);

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

    const handleRiderAssignment = (orderId, riderId) => {
        if (!riderId) return;
        
        setAssigningRider(prev => ({ ...prev, [orderId]: true }));
        router.post(`/admin/orders/${orderId}/assign-rider`, {
            rider_id: riderId,
        }, {
            preserveScroll: true,
            preserveState: false,
            onFinish: () => setAssigningRider(prev => ({ ...prev, [orderId]: false })),
        });
    };

    const handleSnooze = (orderId) => {
        // Snooze this order for 5 minutes
        setSnoozedOrders(prev => ({
            ...prev,
            [orderId]: Date.now(),
        }));
    };

    const getSnoozeTimeRemaining = (orderId) => {
        const snoozedAt = snoozedOrders[orderId];
        if (!snoozedAt) return null;
        
        const now = snoozeDisplayTime; // Use display time for countdown
        const elapsed = now - snoozedAt;
        const remaining = 300000 - elapsed; // 5 minutes = 300000ms
        
        if (remaining <= 0) {
            // Snooze expired, remove from snoozed list
            setSnoozedOrders(prev => {
                const updated = { ...prev };
                delete updated[orderId];
                return updated;
            });
            return null;
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

                {/* Next Order Banner */}
                {(() => {
                    const displayTime = getNextOrderDisplay();
                    const minutesRemaining = getCurrentMinutesRemaining();
                    
                    if (nextOrderInfo && displayTime && minutesRemaining > 0) {
                        return (
                            <div className={`mb-6 p-6 rounded-lg border-2 shadow-lg ${
                                minutesRemaining <= 20 
                                    ? 'bg-red-100 border-red-500 text-red-900 animate-pulse' 
                                    : minutesRemaining <= 60
                                    ? 'bg-orange-100 border-orange-500 text-orange-900'
                                    : 'bg-blue-100 border-blue-500 text-blue-900'
                            }`}>
                                <div className="text-center">
                                    <p className="text-2xl md:text-3xl font-bold mb-2">
                                        Next order is in {displayTime}
                                    </p>
                                    <p className="text-lg opacity-80">
                                        Order #{nextOrderInfo.order_number}
                                    </p>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}

                {nextOrderInfo && nextOrderInfo.raw_minutes_remaining <= 0 && (
                    <div className="mb-6 p-6 rounded-lg border-2 border-red-500 bg-red-100 text-red-900 shadow-lg">
                        <div className="text-center">
                            <p className="text-2xl md:text-3xl font-bold mb-2">
                                ⚠️ Orders are overdue
                            </p>
                            <p className="text-lg opacity-80">
                                Please check the queue for urgent orders
                            </p>
                        </div>
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
                                        <h3 className="text-xl font-bold text-spice-maroon">Order #{order.daily_order_number || order.id}</h3>
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
                                        <p className="font-bold text-lg text-gray-900 mt-1">
                                            Delivery: {formatTime(order.delivery_time)}
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
                                                        {item.is_custom || item.custom_item_name 
                                                            ? item.custom_item_name || 'Custom Item'
                                                            : (item.menuItem?.name || 'Unknown')}
                                                        {(item.is_custom || item.custom_item_name) && (
                                                            <span className="text-xs text-blue-600 ml-1">(Custom)</span>
                                                        )}
                                                        {' × '}
                                                        {item.quantity}
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

                                {/* Snooze Button for Critical/Warning Orders */}
                                {(order.alert_level === 'critical' || order.alert_level === 'warning') && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        {snoozedOrders[order.id] ? (
                                            <div className="mb-3 p-2 bg-gray-100 rounded-lg text-center">
                                                <p className="text-xs text-gray-600 mb-1">Snoozed</p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    Resumes in: {getSnoozeTimeRemaining(order.id) || '0:00'}
                                                </p>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleSnooze(order.id)}
                                                className="w-full mb-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Snooze (5 min)
                                            </button>
                                        )}
                                    </div>
                                )}

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

                                    {/* Rider Assignment */}
                                    <div className="mt-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Delivery Rider
                                        </label>
                                        {order.rider ? (
                                            <div className="text-sm">
                                                <p className="font-semibold text-gray-900">{order.rider.name}</p>
                                                <p className="text-xs text-gray-600">{order.rider.phone}</p>
                                                {riders && riders.length > 0 && (
                                                    <select
                                                        value=""
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                handleRiderAssignment(order.id, e.target.value);
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                        disabled={assigningRider[order.id]}
                                                        className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-xs focus:ring-spice-orange focus:border-spice-orange disabled:opacity-50"
                                                    >
                                                        <option value="">Change rider...</option>
                                                        {riders.filter(r => r.id !== order.rider.id).map((rider) => (
                                                            <option key={rider.id} value={rider.id}>
                                                                {rider.name} - {rider.phone}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        ) : (
                                            riders && riders.length > 0 ? (
                                                <select
                                                    value=""
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleRiderAssignment(order.id, e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                    disabled={assigningRider[order.id]}
                                                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:ring-spice-orange focus:border-spice-orange disabled:opacity-50"
                                                >
                                                    <option value="">Select rider...</option>
                                                    {riders.map((rider) => (
                                                        <option key={rider.id} value={rider.id}>
                                                            {rider.name} - {rider.phone}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p className="text-xs text-gray-500">No riders available</p>
                                            )
                                        )}
                                        {assigningRider[order.id] && (
                                            <p className="text-xs text-blue-600 mt-1">Assigning...</p>
                                        )}
                                    </div>

                                    {/* SMS Message Details */}
                                    {order.sms_message && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-xs font-medium text-gray-700 mb-2">SMS Details (sent to rider):</p>
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                                                    {order.sms_message}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                    
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

