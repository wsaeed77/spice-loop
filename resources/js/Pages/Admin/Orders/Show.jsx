import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../../Components/Layout';

export default function OrderShow({ auth, order, cities, menuItems, riders, flash }) {
    const [editMode, setEditMode] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [addItemType, setAddItemType] = useState('menu'); // 'menu' or 'custom'
    const [removingItemId, setRemovingItemId] = useState(null);
    const [assigningRider, setAssigningRider] = useState(false);

    const statusForm = useForm({
        status: order?.status || 'pending',
    });

    const orderForm = useForm({
        customer_address: order?.customer_address || '',
        customer_postcode: order?.customer_postcode || '',
        delivery_date: order?.delivery_date || '',
        delivery_time: order?.delivery_time || '',
        delivery_distance: order?.delivery_distance || '',
        delivery_charge: order?.delivery_charge || 0,
    });

    const addItemForm = useForm({
        menu_item_id: '',
        menu_item_option_id: '',
        custom_item_name: '',
        price: '',
        quantity: 1,
    }, {
        resetOnSuccess: false,
    });

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        statusForm.patch(`/admin/orders/${order.id}/status`, {
            preserveScroll: true,
        });
    };

    const handleOrderUpdate = (e) => {
        e.preventDefault();
        orderForm.patch(`/admin/orders/${order.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditMode(false);
            },
        });
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (addItemType === 'custom') {
            if (!addItemForm.data.custom_item_name || !addItemForm.data.price) {
                alert('Please fill in all required fields for custom item.');
                return;
            }
        } else {
            if (!addItemForm.data.menu_item_id) {
                alert('Please select a menu item.');
                return;
            }
        }
        
        // Prepare form data based on item type
        let submitData = {
            quantity: parseInt(addItemForm.data.quantity) || 1,
        };
        
        if (addItemType === 'custom') {
            // Custom item
            submitData.custom_item_name = addItemForm.data.custom_item_name;
            submitData.price = parseFloat(addItemForm.data.price);
            submitData.menu_item_id = null;
            submitData.menu_item_option_id = null;
        } else {
            // Menu item
            submitData.menu_item_id = addItemForm.data.menu_item_id;
            submitData.menu_item_option_id = addItemForm.data.menu_item_option_id || null;
            submitData.custom_item_name = null;
            submitData.price = null;
        }
        
        // Use router.post directly to avoid form state issues
        router.post(`/admin/orders/${order.id}/items`, submitData, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddItemModal(false);
                setAddItemType('menu');
                addItemForm.reset();
            },
            onError: (errors) => {
                console.error('Error adding item:', errors);
                // Display validation errors
                if (errors.custom_item_name) {
                    alert('Custom item name error: ' + errors.custom_item_name);
                }
                if (errors.price) {
                    alert('Price error: ' + errors.price);
                }
                if (errors.menu_item_id) {
                    alert('Menu item error: ' + errors.menu_item_id);
                }
            },
        });
    };

    const handleRemoveItem = (itemId) => {
        if (window.confirm('Are you sure you want to remove this item from the order?')) {
            setRemovingItemId(itemId);
            router.delete(`/admin/orders/${order.id}/items/${itemId}`, {
                preserveScroll: true,
                onFinish: () => setRemovingItemId(null),
            });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'In Queue': 'bg-blue-100 text-blue-800 border-blue-300',
            'confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
            'preparing': 'bg-purple-100 text-purple-800 border-purple-300',
            'ready': 'bg-green-100 text-green-800 border-green-300',
            'out for delivery': 'bg-orange-100 text-orange-800 border-orange-300',
            'delivered': 'bg-gray-100 text-gray-800 border-gray-300',
            'cancelled': 'bg-red-100 text-red-800 border-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
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
        { value: 'In Queue', label: 'In Queue' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'ready', label: 'Ready' },
        { value: 'out for delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    if (!order) {
        return (
            <Layout auth={auth}>
                <Head title="Order Not Found - SpiceLoop" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-gray-500">Order not found.</p>
                    <Link href="/admin/orders-queue" className="text-spice-orange hover:text-spice-maroon">
                        ← Back to Orders Queue
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout auth={auth}>
            <Head title={`Order #${order.daily_order_number || order.id} - SpiceLoop`} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Order #{order.daily_order_number || order.id}</h1>
                    <Link
                        href="/admin/orders-queue"
                        className="text-spice-orange hover:text-spice-maroon"
                    >
                        ← Back to Orders Queue
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
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-spice-maroon">Order Items</h2>
                                <button
                                    onClick={() => setShowAddItemModal(true)}
                                    className="bg-spice-orange hover:bg-spice-gold text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                                >
                                    + Add Item
                                </button>
                            </div>
                            {order.orderItems && order.orderItems.length > 0 ? (
                                <div className="space-y-4">
                                    {order.orderItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">
                                                    {item.is_custom || item.custom_item_name 
                                                        ? item.custom_item_name || 'Custom Item'
                                                        : (item.menuItem?.name || 'Unknown Item')}
                                                </p>
                                                {(item.is_custom || item.custom_item_name) && (
                                                    <p className="text-xs text-blue-600">Custom Item</p>
                                                )}
                                                <p className="text-sm text-gray-500">
                                                    Quantity: {item.quantity} × £{parseFloat(item.price).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-semibold text-gray-900">
                                                    £{(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}
                                                </p>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={removingItemId === item.id}
                                                    className="text-red-600 hover:text-red-800 disabled:opacity-50 text-sm"
                                                >
                                                    {removingItemId === item.id ? 'Removing...' : 'Remove'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-spice-orange">
                                        <p className="text-xl font-bold text-spice-maroon">Total</p>
                                        <p className="text-xl font-bold text-spice-maroon">
                                            £{parseFloat(order.total_amount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No items in this order.</p>
                            )}
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-spice-maroon">Order Details</h2>
                                {!editMode ? (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="bg-spice-orange hover:bg-spice-gold text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditMode(false);
                                                orderForm.reset();
                                            }}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleOrderUpdate}
                                            disabled={orderForm.processing}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm disabled:opacity-50"
                                        >
                                            {orderForm.processing ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold text-gray-900">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">{order.customer_email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-semibold text-gray-900">{order.customer_phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    {editMode ? (
                                        <textarea
                                            value={orderForm.data.customer_address}
                                            onChange={(e) => orderForm.setData('customer_address', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                                            rows="3"
                                        />
                                    ) : (
                                        <p className="font-semibold text-gray-900">{order.customer_address}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Postcode</p>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={orderForm.data.customer_postcode || ''}
                                            onChange={(e) => orderForm.setData('customer_postcode', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                                        />
                                    ) : (
                                        <p className="font-semibold text-gray-900">{order.customer_postcode || 'N/A'}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Delivery Date</p>
                                    {editMode ? (
                                        <input
                                            type="date"
                                            value={orderForm.data.delivery_date || ''}
                                            onChange={(e) => orderForm.setData('delivery_date', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    ) : (
                                        <p className="font-semibold text-gray-900">
                                            {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString('en-GB') : 'N/A'}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Delivery Time</p>
                                    {editMode ? (
                                        <>
                                            <input
                                                type="time"
                                                value={orderForm.data.delivery_time || ''}
                                                onChange={(e) => {
                                                    // Ensure time is in HH:MM format (24-hour)
                                                    const timeValue = e.target.value;
                                                    if (timeValue) {
                                                        orderForm.setData('delivery_time', timeValue);
                                                    } else {
                                                        orderForm.setData('delivery_time', '');
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    // Normalize time on blur to ensure proper format
                                                    const timeValue = e.target.value;
                                                    if (timeValue && timeValue.match(/^\d{2}:\d{2}$/)) {
                                                        orderForm.setData('delivery_time', timeValue);
                                                    }
                                                }}
                                                step="60"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Format: 24-hour (e.g., 14:30 for 2:30 PM)</p>
                                        </>
                                    ) : (
                                        <p className="font-semibold text-gray-900">{order.delivery_time || 'N/A'}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Drive Distance (minutes)</p>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            step="1"
                                            min="0"
                                            value={orderForm.data.delivery_distance || ''}
                                            onChange={(e) => orderForm.setData('delivery_distance', parseInt(e.target.value) || '')}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                                            placeholder="e.g., 15"
                                        />
                                    ) : (
                                        <p className="font-semibold text-gray-900">
                                            {order.delivery_distance ? `${order.delivery_distance} minutes` : 'N/A'}
                                        </p>
                                    )}
                                </div>
                                {order.city && (
                                    <div>
                                        <p className="text-sm text-gray-500">City</p>
                                        <p className="font-semibold text-gray-900">{order.city.name}</p>
                                    </div>
                                )}
                                {order.allergies && (
                                    <div>
                                        <p className="text-sm text-gray-500">Allergies</p>
                                        <p className="font-semibold text-gray-900">{order.allergies}</p>
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
                                        value={statusForm.data.status}
                                        onChange={(e) => statusForm.setData('status', e.target.value)}
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
                                    disabled={statusForm.processing}
                                    className="w-full px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold transition disabled:opacity-50"
                                >
                                    {statusForm.processing ? 'Updating...' : 'Update Status'}
                                </button>
                            </form>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Current Status:</p>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Assign Rider */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Assign Delivery Rider</h2>
                            {order.rider ? (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Assigned Rider</p>
                                        <p className="font-semibold text-gray-900">{order.rider.name}</p>
                                        <p className="text-sm text-gray-600">{order.rider.phone}</p>
                                    </div>
                                    {riders && riders.length > 0 && (
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            setAssigningRider(true);
                                            router.post(`/admin/orders/${order.id}/assign-rider`, {
                                                rider_id: e.target.rider_id.value,
                                            }, {
                                                preserveScroll: true,
                                                onFinish: () => setAssigningRider(false),
                                            });
                                        }}>
                                            <div className="mb-3">
                                                <label htmlFor="rider_id" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Change Rider
                                                </label>
                                                <select
                                                    id="rider_id"
                                                    name="rider_id"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                                    required
                                                >
                                                    <option value="">Select a rider</option>
                                                    {riders.map((rider) => (
                                                        <option key={rider.id} value={rider.id}>
                                                            {rider.name} - {rider.phone}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={assigningRider}
                                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
                                            >
                                                {assigningRider ? 'Assigning...' : 'Reassign Rider'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            ) : (
                                riders && riders.length > 0 ? (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        setAssigningRider(true);
                                        router.post(`/admin/orders/${order.id}/assign-rider`, {
                                            rider_id: e.target.rider_id.value,
                                        }, {
                                            preserveScroll: true,
                                            onFinish: () => setAssigningRider(false),
                                        });
                                    }}>
                                        <div className="mb-3">
                                            <label htmlFor="rider_id" className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Rider *
                                            </label>
                                            <select
                                                id="rider_id"
                                                name="rider_id"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                                required
                                            >
                                                <option value="">Select a rider</option>
                                                {riders.map((rider) => (
                                                    <option key={rider.id} value={rider.id}>
                                                        {rider.name} - {rider.phone}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={assigningRider}
                                            className="w-full px-4 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold transition disabled:opacity-50"
                                        >
                                            {assigningRider ? 'Assigning...' : 'Assign Rider & Send SMS'}
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-gray-500 text-sm">
                                        No active riders available. <Link href="/admin/riders/create" className="text-spice-orange hover:text-spice-maroon">Create a rider</Link>
                                    </p>
                                )
                            )}
                        </div>

                        {/* Order Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Order Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Order Number</p>
                                    <p className="font-semibold text-gray-900">#{order.daily_order_number || order.id}</p>
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

                {/* Add Item Modal */}
                {showAddItemModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                            <h3 className="text-2xl font-bold text-spice-maroon mb-4">Add Item</h3>
                            
                            {/* Item Type Tabs */}
                            <div className="flex gap-2 mb-4 border-b border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setAddItemType('menu')}
                                    className={`flex-1 py-2 px-4 font-semibold transition ${
                                        addItemType === 'menu'
                                            ? 'text-spice-orange border-b-2 border-spice-orange'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Menu Item
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAddItemType('custom')}
                                    className={`flex-1 py-2 px-4 font-semibold transition ${
                                        addItemType === 'custom'
                                            ? 'text-spice-orange border-b-2 border-spice-orange'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Custom Item
                                </button>
                            </div>

                            <form onSubmit={handleAddItem} className="space-y-4">
                                {addItemType === 'menu' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Menu Item *
                                            </label>
                                            <select
                                                value={addItemForm.data.menu_item_id}
                                                onChange={(e) => {
                                                    addItemForm.setData('menu_item_id', e.target.value);
                                                    addItemForm.setData('menu_item_option_id', '');
                                                    addItemForm.setData('custom_item_name', '');
                                                    addItemForm.setData('price', '');
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                required={addItemType === 'menu'}
                                            >
                                                <option value="">Select an item</option>
                                                {menuItems && menuItems.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name} - £{parseFloat(item.price).toFixed(2)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {addItemForm.data.menu_item_id && (() => {
                                            const selectedItem = menuItems?.find(item => item.id == addItemForm.data.menu_item_id);
                                            return selectedItem?.options && selectedItem.options.length > 0 ? (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Variant (Optional)
                                                    </label>
                                                    <select
                                                        value={addItemForm.data.menu_item_option_id || ''}
                                                        onChange={(e) => addItemForm.setData('menu_item_option_id', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                    >
                                                        <option value="">Default - £{parseFloat(selectedItem.price).toFixed(2)}</option>
                                                        {selectedItem.options.map((option) => (
                                                            <option key={option.id} value={option.id}>
                                                                {option.name} - £{parseFloat(option.price).toFixed(2)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : null;
                                        })()}
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Item Name / Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={addItemForm.data.custom_item_name}
                                                onChange={(e) => {
                                                    addItemForm.setData('custom_item_name', e.target.value);
                                                    addItemForm.setData('menu_item_id', '');
                                                    addItemForm.setData('menu_item_option_id', '');
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                placeholder="e.g., Special Curry"
                                                required={addItemType === 'custom'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Price *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={addItemForm.data.price}
                                                onChange={(e) => {
                                                    addItemForm.setData('price', e.target.value);
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                placeholder="e.g., 15.99"
                                                required={addItemType === 'custom'}
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={addItemForm.data.quantity}
                                        onChange={(e) => addItemForm.setData('quantity', parseInt(e.target.value) || 1)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddItemModal(false);
                                            setAddItemType('menu');
                                            addItemForm.reset();
                                        }}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={addItemForm.processing || (addItemType === 'menu' && !addItemForm.data.menu_item_id) || (addItemType === 'custom' && (!addItemForm.data.custom_item_name || !addItemForm.data.price))}
                                        className="flex-1 bg-spice-orange hover:bg-spice-gold text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addItemForm.processing ? 'Adding...' : 'Add Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

