import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../Components/Layout';

export default function Menu({ auth, menuItems, cities, flash }) {
    const [cart, setCart] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showCartMessage, setShowCartMessage] = useState(false);
    const [addedItemName, setAddedItemName] = useState('');
    
    // Map database categories to main display categories
    const categoryMapping = {
        // Main Course categories
        'Curries': 'Main Course',
        'Rice Dishes': 'Main Course',
        'Biryani': 'Main Course',
        'Vegetarian': 'Main Course',
        'Non-Vegetarian': 'Main Course',
        // Sides categories
        'Breads': 'Sides',
        'Appetizers': 'Sides',
        'Sides': 'Sides',
        // Sweet categories
        'Desserts': 'Sweet',
    };
    
    // Main category tabs
    const mainCategories = ['all', 'Main Course', 'Sides', 'Sweet'];
    
    // Filter items by main category
    const getItemsByMainCategory = (mainCategory) => {
        if (mainCategory === 'all') return menuItems;
        return menuItems?.filter(item => {
            const itemMainCategory = categoryMapping[item.category] || item.category;
            return itemMainCategory === mainCategory;
        });
    };
    
    // Get filtered menu items based on selected category
    const filteredMenuItems = getItemsByMainCategory(selectedCategory);

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
        
        // Show success message
        setAddedItemName(item.name);
        setShowCartMessage(true);
        
        // Scroll cart into view on mobile after a short delay
        setTimeout(() => {
            const cartElement = document.getElementById('cart-sidebar');
            if (cartElement && window.innerWidth < 1024) {
                cartElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
        
        // Hide message after 3 seconds
        setTimeout(() => {
            setShowCartMessage(false);
        }, 3000);
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

                {/* Cart Success Message */}
                {showCartMessage && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-[fadeIn_0.3s_ease-in-out] max-w-sm mx-4">
                        <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 border-2 border-green-600">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div className="flex-1">
                                <span className="font-semibold text-sm sm:text-base block">{addedItemName} added to cart!</span>
                                {cart.length > 0 && (
                                    <span className="text-xs opacity-90 block mt-1">Cart: {cart.length} {cart.length === 1 ? 'item' : 'items'} • £{total.toFixed(2)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Tabs */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-4">
                        {mainCategories.map((mainCategory) => {
                            const itemsInCategory = getItemsByMainCategory(mainCategory);
                            const isActive = selectedCategory === mainCategory;
                            const displayName = mainCategory === 'all' ? 'All Items' : mainCategory;
                            
                            return (
                                <button
                                    key={mainCategory}
                                    onClick={() => setSelectedCategory(mainCategory)}
                                    className={`px-6 py-3 rounded-t-lg font-semibold transition-all ${
                                        isActive
                                            ? 'bg-spice-orange text-white border-b-2 border-spice-orange'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {displayName}
                                    {itemsInCategory && itemsInCategory.length > 0 && (
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                            isActive ? 'bg-white text-spice-orange' : 'bg-spice-orange text-white'
                                        }`}>
                                            {itemsInCategory.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Cart Summary Bar (sticky at bottom on mobile) */}
                {cart.length > 0 && (
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-spice-orange shadow-lg z-40">
                        <div className="max-w-7xl mx-auto px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</p>
                                    <p className="text-lg font-bold text-spice-maroon">£{total.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        document.getElementById('cart-sidebar')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="bg-spice-orange hover:bg-spice-gold text-white px-6 py-2 rounded-lg font-semibold transition"
                                >
                                    View Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 lg:mb-0">
                    {/* Menu Items */}
                    <div className="lg:col-span-2">
                        {filteredMenuItems && filteredMenuItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredMenuItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                                    <div className="h-48 rounded mb-4 overflow-hidden bg-gray-200 flex items-center justify-center">
                                        {item.image ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : null}
                                        {!item.image && (
                                            <span className="text-gray-400">No Image</span>
                                        )}
                                    </div>
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
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-spice-orange">
                                <p className="text-gray-500 text-lg">No items found in this category.</p>
                            </div>
                        )}
                    </div>

                    {/* Cart Sidebar */}
                    <div className="lg:col-span-1">
                        <div id="cart-sidebar" className="bg-white rounded-lg shadow-md p-6 border border-spice-orange sticky top-4 lg:sticky lg:top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-spice-maroon">Cart</h2>
                                {cart.length > 0 && (
                                    <span className="bg-spice-orange text-white text-sm font-bold px-3 py-1 rounded-full">
                                        {cart.length} {cart.length === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </div>
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

