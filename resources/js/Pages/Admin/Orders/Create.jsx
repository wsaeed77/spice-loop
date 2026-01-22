import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import Layout from '../../../Components/Layout';

// Convert 12-hour format (with AM/PM) to 24-hour format
function convertTo24Hour(timeString) {
    if (!timeString) return '';
    
    // Remove extra spaces and convert to uppercase
    timeString = timeString.trim().toUpperCase();
    
    // Check if it's already in 24-hour format (HH:MM or H:MM)
    const time24Regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (time24Regex.test(timeString)) {
        // Ensure it's HH:MM format (two digits for hour)
        const parts = timeString.split(':');
        const hour = parts[0].padStart(2, '0');
        const minute = parts[1].padStart(2, '0');
        return `${hour}:${minute}`;
    }
    
    // Try to parse 12-hour format with AM/PM
    const time12Regex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = timeString.match(time12Regex);
    
    if (match) {
        let hour = parseInt(match[1], 10);
        const minute = match[2].padStart(2, '0');
        const period = match[3].toUpperCase();
        
        if (hour === 12) {
            hour = period === 'AM' ? 0 : 12;
        } else if (period === 'PM') {
            hour += 12;
        }
        
        return `${hour.toString().padStart(2, '0')}:${minute}`;
    }
    
    // Try to parse format like "2:30PM" (no space)
    const time12NoSpaceRegex = /^(\d{1,2}):(\d{2})(AM|PM)$/i;
    const matchNoSpace = timeString.match(time12NoSpaceRegex);
    
    if (matchNoSpace) {
        let hour = parseInt(matchNoSpace[1], 10);
        const minute = matchNoSpace[2].padStart(2, '0');
        const period = matchNoSpace[3].toUpperCase();
        
        if (hour === 12) {
            hour = period === 'AM' ? 0 : 12;
        } else if (period === 'PM') {
            hour += 12;
        }
        
        return `${hour.toString().padStart(2, '0')}:${minute}`;
    }
    
    return null;
}

// Fix time format - attempt to fix common formatting issues
function fixTimeFormat(timeString) {
    if (!timeString) return '';
    
    timeString = timeString.trim();
    
    // Remove all non-digit and colon characters except AM/PM
    let cleaned = timeString.replace(/[^\d:APM]/gi, '');
    
    // Try to extract time pattern
    const timePattern = /(\d{1,2}):?(\d{0,2})\s*(AM|PM)?/i;
    const match = cleaned.match(timePattern);
    
    if (match) {
        let hour = parseInt(match[1] || '0', 10);
        let minute = match[2] || '00';
        const period = match[3];
        
        if (minute.length === 1) minute = minute.padStart(2, '0');
        if (minute.length > 2) minute = minute.substring(0, 2);
        
        if (period) {
            return convertTo24Hour(`${hour}:${minute} ${period}`);
        } else if (hour <= 23 && minute.length === 2) {
            return `${hour.toString().padStart(2, '0')}:${minute}`;
        }
    }
    
    return null;
}

export default function OrderCreate({ auth, cities, menuItems, flash }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [showCustomItemModal, setShowCustomItemModal] = useState(false);
    const [customItem, setCustomItem] = useState({ name: '', price: '', quantity: 1 });
    
    const { data, setData, post, processing, errors } = useForm({
        city_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        customer_postcode: '',
        delivery_date: '',
        delivery_time: '',
        delivery_distance: '',
        allergies: '',
        notes: '',
        delivery_charge: 0,
        payment_type: '',
        items: [],
    });

    const addItem = (menuItem, option = null) => {
        const price = option ? parseFloat(option.price) : parseFloat(menuItem.price);
        const newItem = {
            menu_item_id: menuItem.id,
            menu_item_option_id: option?.id || null,
            quantity: 1,
            price: price,
            menuItem: menuItem,
            option: option,
        };
        setSelectedItems([...selectedItems, newItem]);
    };

    const removeItem = (index) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const updateQuantity = (index, quantity) => {
        if (quantity < 1) return;
        const updated = [...selectedItems];
        updated[index].quantity = quantity;
        setSelectedItems(updated);
    };

    const addCustomItem = () => {
        if (!customItem.name || !customItem.price) {
            alert('Please enter item name and price.');
            return;
        }
        
        const newItem = {
            custom_item_name: customItem.name,
            menu_item_id: null,
            menu_item_option_id: null,
            quantity: parseInt(customItem.quantity) || 1,
            price: parseFloat(customItem.price) || 0,
            menuItem: null,
            option: null,
            isCustom: true,
        };
        setSelectedItems([...selectedItems, newItem]);
        setCustomItem({ name: '', price: '', quantity: 1 });
        setShowCustomItemModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (selectedItems.length === 0) {
            alert('Please add at least one menu item to the order.');
            return;
        }
        
        // Validate and normalize delivery time before submission
        let normalizedTime = data.delivery_time ? data.delivery_time.trim() : '';
        if (!normalizedTime) {
            alert('Please enter a delivery time (e.g., 2:30 PM or 14:30).');
            const timeInput = document.querySelector('input[name="delivery_time"]');
            if (timeInput) timeInput.focus();
            return;
        }
        
        // Convert 12-hour format (with AM/PM) to 24-hour format
        const converted = convertTo24Hour(normalizedTime);
        if (converted) {
            normalizedTime = converted;
        } else {
            const fixed = fixTimeFormat(normalizedTime);
            if (fixed) {
                normalizedTime = fixed;
            } else {
                alert('Invalid time format. Please use format like "2:30 PM" or "14:30".');
                const timeInput = document.querySelector('input[name="delivery_time"]');
                if (timeInput) timeInput.focus();
                return;
            }
        }
        
        // Validate final format
        if (!normalizedTime || !normalizedTime.match(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)) {
            alert('Invalid time format. Please use format like "2:30 PM" or "14:30".');
            const timeInput = document.querySelector('input[name="delivery_time"]');
            if (timeInput) timeInput.focus();
            return;
        }
        
        const items = selectedItems.map(item => {
            if (item.isCustom || item.custom_item_name) {
                // Custom item
                return {
                    custom_item_name: item.custom_item_name || item.name,
                    menu_item_id: null,
                    menu_item_option_id: null,
                    quantity: parseInt(item.quantity) || 1,
                    price: parseFloat(item.price) || 0,
                };
            } else {
                // Regular menu item
                return {
                    menu_item_id: item.menu_item_id,
                    menu_item_option_id: item.menu_item_option_id || null,
                    quantity: parseInt(item.quantity) || 1,
                    price: parseFloat(item.price) || 0,
                };
            }
        });

        // Prepare complete form data with items included (use normalized time)
        const formData = {
            ...data,
            delivery_time: normalizedTime,
            items: items,
        };
        
        // Use router.post directly with complete data to avoid race condition
        router.post('/admin/orders', formData, {
            preserveState: false,
            preserveScroll: false,
            onSuccess: () => {
                setSelectedItems([]);
                setData({
                    city_id: '',
                    customer_name: '',
                    customer_email: '',
                    customer_phone: '',
                    customer_address: '',
                    customer_postcode: '',
                    delivery_date: '',
                    delivery_time: '',
                    delivery_distance: '',
                    allergies: '',
                    notes: '',
                    delivery_charge: 0,
                    payment_type: '',
                    items: [],
                });
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
                console.log('Items being sent:', items);
                console.log('Form data:', formData);
            },
        });
    };

    const calculateTotal = () => {
        const itemsTotal = selectedItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);
        return itemsTotal + parseFloat(data.delivery_charge || 0);
    };

    return (
        <Layout auth={auth}>
            <Head title="Create Order - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Create New Order</h1>
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Customer Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                                    <input
                                        type="text"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        required
                                    />
                                    {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={data.customer_email}
                                        onChange={(e) => setData('customer_email', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                    {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                    <input
                                        type="tel"
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        required
                                    />
                                    {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                    <textarea
                                        value={data.customer_address}
                                        onChange={(e) => setData('customer_address', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        rows="3"
                                        required
                                    />
                                    {errors.customer_address && <p className="text-red-500 text-sm mt-1">{errors.customer_address}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                                    <input
                                        type="text"
                                        value={data.customer_postcode}
                                        onChange={(e) => setData('customer_postcode', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                    {errors.customer_postcode && <p className="text-red-500 text-sm mt-1">{errors.customer_postcode}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <select
                                        value={data.city_id}
                                        onChange={(e) => setData('city_id', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        required
                                    >
                                        <option value="">Select a city</option>
                                        {cities && cities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.city_id && <p className="text-red-500 text-sm mt-1">{errors.city_id}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Delivery Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date *</label>
                                    <input
                                        type="date"
                                        value={data.delivery_date}
                                        onChange={(e) => setData('delivery_date', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                    {errors.delivery_date && <p className="text-red-500 text-sm mt-1">{errors.delivery_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time *</label>
                                    <input
                                        type="text"
                                        value={data.delivery_time}
                                        onChange={(e) => {
                                            let timeValue = e.target.value;
                                            setData('delivery_time', timeValue);
                                        }}
                                        onBlur={(e) => {
                                            // Convert 12-hour format (with AM/PM) to 24-hour format
                                            let timeValue = e.target.value.trim();
                                            if (timeValue) {
                                                const normalized = convertTo24Hour(timeValue);
                                                if (normalized) {
                                                    setData('delivery_time', normalized);
                                                    // Update the input value to show normalized format
                                                    e.target.value = normalized;
                                                } else {
                                                    // If conversion fails, try to fix format
                                                    const fixed = fixTimeFormat(timeValue);
                                                    if (fixed) {
                                                        setData('delivery_time', fixed);
                                                        e.target.value = fixed;
                                                    }
                                                }
                                            }
                                        }}
                                        placeholder="e.g., 2:30 PM or 14:30"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        name="delivery_time"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Format: 2:30 PM, 14:30, or 02:30 (24-hour)</p>
                                    {errors.delivery_time && <p className="text-red-500 text-sm mt-1">{errors.delivery_time}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Drive Distance (minutes)</label>
                                    <input
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={data.delivery_distance}
                                        onChange={(e) => setData('delivery_distance', parseInt(e.target.value) || '')}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        placeholder="e.g., 15"
                                    />
                                    {errors.delivery_distance && <p className="text-red-500 text-sm mt-1">{errors.delivery_distance}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charge</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.delivery_charge}
                                        onChange={(e) => setData('delivery_charge', parseFloat(e.target.value) || 0)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                    {errors.delivery_charge && <p className="text-red-500 text-sm mt-1">{errors.delivery_charge}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                                    <select
                                        value={data.payment_type}
                                        onChange={(e) => setData('payment_type', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    >
                                        <option value="">Select payment type</option>
                                        <option value="cash">Cash</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="card_payment">Card Payment</option>
                                    </select>
                                    {errors.payment_type && <p className="text-red-500 text-sm mt-1">{errors.payment_type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                                    <textarea
                                        value={data.allergies}
                                        onChange={(e) => setData('allergies', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        rows="2"
                                    />
                                    {errors.allergies && <p className="text-red-500 text-sm mt-1">{errors.allergies}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        rows="2"
                                    />
                                    {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-spice-maroon">Menu Items</h2>
                            <button
                                type="button"
                                onClick={() => setShowCustomItemModal(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                            >
                                + Add Custom Item
                            </button>
                        </div>
                        
                        {/* Selected Items */}
                        {selectedItems.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {selectedItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center border-b pb-2">
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                {item.isCustom || item.custom_item_name 
                                                    ? item.custom_item_name || item.name 
                                                    : (item.menuItem?.name || 'Unknown')}
                                            </p>
                                            {item.option && !item.isCustom && <p className="text-sm text-gray-500">{item.option.name}</p>}
                                            {(item.isCustom || item.custom_item_name) && (
                                                <p className="text-xs text-blue-600">Custom Item</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                                                className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
                                            />
                                            <span className="w-24 text-right font-semibold">
                                                £{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-2 border-t-2 border-spice-orange">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-lg text-spice-maroon">£{calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {/* Available Menu Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                            {menuItems && menuItems.map((menuItem) => (
                                <div key={menuItem.id} className="border border-gray-300 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1">{menuItem.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">£{parseFloat(menuItem.price).toFixed(2)}</p>
                                    {menuItem.options && menuItem.options.length > 0 ? (
                                        <div className="space-y-1">
                                            <button
                                                type="button"
                                                onClick={() => addItem(menuItem, null)}
                                                className="w-full text-left text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded mb-1"
                                            >
                                                Default - £{parseFloat(menuItem.price).toFixed(2)}
                                            </button>
                                            {menuItem.options.map((option) => (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    onClick={() => addItem(menuItem, option)}
                                                    className="w-full text-left text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                                                >
                                                    {option.name} - £{parseFloat(option.price).toFixed(2)}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => addItem(menuItem, null)}
                                            className="w-full bg-spice-orange hover:bg-spice-gold text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                                        >
                                            Add to Order
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.items && <p className="text-red-500 text-sm mt-2">{errors.items}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/admin/orders"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || selectedItems.length === 0}
                            className="bg-spice-orange hover:bg-spice-gold text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating...' : 'Create Order'}
                        </button>
                    </div>
                </form>

                {/* Custom Item Modal */}
                {showCustomItemModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                            <h3 className="text-2xl font-bold text-spice-maroon mb-4">Add Custom Item</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Item Name / Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={customItem.name}
                                        onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="e.g., Special Curry"
                                        required
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
                                        value={customItem.price}
                                        onChange={(e) => setCustomItem({ ...customItem, price: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="e.g., 15.99"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={customItem.quantity}
                                        onChange={(e) => setCustomItem({ ...customItem, quantity: parseInt(e.target.value) || 1 })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCustomItemModal(false);
                                            setCustomItem({ name: '', price: '', quantity: 1 });
                                        }}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addCustomItem}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

