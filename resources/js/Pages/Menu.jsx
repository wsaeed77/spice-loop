import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../Components/Layout';

export default function Menu({ auth, menuItems, cities, flash }) {
    const [cart, setCart] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        city_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        items: [],
        notes: '',
    });

    const addToCart = (item) => {
        const existingItem = cart.find(c => c.id === item.id);
        if (existingItem) {
            setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(c => c.id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            setCart(cart.map(c => c.id === itemId ? { ...c, quantity } : c));
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        setData('items', cart.map(item => ({
            menu_item_id: item.id,
            quantity: item.quantity,
        })));
        post('/orders', {
            onSuccess: () => {
                setCart([]);
                setShowCheckout(false);
            },
        });
    };

    return (
        <Layout auth={auth}>
            <Head title="Menu - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-spice-maroon mb-8">Our Menu</h1>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Menu Items */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {menuItems?.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                                    <h3 className="text-xl font-bold text-spice-maroon mb-2">{item.name}</h3>
                                    <p className="text-gray-600 mb-4">{item.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-spice-orange">£{item.price}</span>
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="bg-spice-orange hover:bg-spice-gold text-white px-4 py-2 rounded-lg font-semibold transition"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cart Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange sticky top-4">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Cart</h2>
                            {cart.length === 0 ? (
                                <p className="text-gray-500">Your cart is empty</p>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-4">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center border-b pb-2">
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                                                        >
                                                            -
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</p>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-red-500 text-sm hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t pt-4 mb-4">
                                        <div className="flex justify-between text-xl font-bold text-spice-maroon">
                                            <span>Total:</span>
                                            <span>£{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowCheckout(true)}
                                        className="w-full bg-spice-orange hover:bg-spice-gold text-white py-3 rounded-lg font-semibold transition"
                                    >
                                        Checkout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Checkout Modal */}
                {showCheckout && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-6">Checkout</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <select
                                            value={data.city_id}
                                            onChange={(e) => setData('city_id', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            required
                                        >
                                            <option value="">Select a city</option>
                                            {cities?.map((city) => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                        {errors.city_id && <p className="text-red-500 text-sm mt-1">{errors.city_id}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            required
                                        />
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
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            rows="3"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCheckout(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold"
                                    >
                                        {processing ? 'Processing...' : 'Place Order'}
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

