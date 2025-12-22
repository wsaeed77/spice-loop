import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Layout from '../Components/Layout';
import { useCart } from '../contexts/CartContext';

export default function Menu({ auth, menuItems, cities, deliveryCost = 0, flash }) {
    const { cart, addToCart: addToCartContext, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('South Asian Cuisine');
    const [showCartMessage, setShowCartMessage] = useState(false);
    const [addedItemName, setAddedItemName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSpecialOrderModal, setShowSpecialOrderModal] = useState(false);
    const [selectedSpecialOrderItem, setSelectedSpecialOrderItem] = useState(null);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [selectedItemForVariant, setSelectedItemForVariant] = useState(null);
    
    // Main category tabs - these match the type options
    const mainCategories = ['South Asian Cuisine', 'Fast Food', 'Sides & Drinks', 'Dessert'];
    
    // Filter items by type (which determines the tab)
    const getItemsByMainCategory = (mainCategory) => {
        return menuItems?.filter(item => {
            // Use type to determine which tab the item belongs to
            return item.type === mainCategory;
        });
    };
    
    // Get filtered menu items based on selected category
    // Default to first category if none selected
    const activeCategory = selectedCategory || mainCategories[0];
    const categoryFilteredItems = getItemsByMainCategory(activeCategory);
    
    // Apply search filter on top of category filter
    const filteredMenuItems = useMemo(() => {
        if (!searchQuery.trim()) {
            return categoryFilteredItems || [];
        }
        const query = searchQuery.toLowerCase();
        return (categoryFilteredItems || []).filter(item => 
            item.name?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query)
        );
    }, [categoryFilteredItems, searchQuery]);

    const { data, setData, post, processing, errors } = useForm({
        city_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        customer_postcode: '',
        allergies: '',
        items: [],
        notes: '',
    });

    const addToCart = (item, selectedOption = null) => {
        // If item has options and no option is selected, show variant modal
        if (item.options && item.options.length > 0 && !selectedOption) {
            setSelectedItemForVariant(item);
            setShowVariantModal(true);
            return;
        }

        // Prepare cart item with variant info
        const cartItem = {
            ...item,
            quantity: 1,
            selectedOption: selectedOption || null,
            // Use variant price if option is selected, otherwise use item price
            price: selectedOption ? parseFloat(selectedOption.price) : parseFloat(item.price),
        };

        // Check if same item with same variant already exists in cart
        const existingItemIndex = cart.findIndex(c => {
            if (c.id !== item.id) return false;
            
            const cOptionId = c.selectedOption?.id || null;
            const newOptionId = selectedOption?.id || null;
            
            return cOptionId === newOptionId;
        });

        // Use the context's addToCart function
        addToCartContext(item, selectedOption);
        
        // Show success message
        const displayName = selectedOption ? `${item.name} (${selectedOption.name})` : item.name;
        setAddedItemName(displayName);
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

        // Close variant modal if it was open
        if (showVariantModal) {
            setShowVariantModal(false);
            setSelectedItemForVariant(null);
        }
    };

    const handleVariantSelect = (item, option) => {
        addToCart(item, option);
    };

    const handleRemoveFromCart = (cartIndex) => {
        removeFromCart(cartIndex);
    };

    const handleUpdateQuantity = (cartIndex, quantity) => {
        updateQuantity(cartIndex, quantity);
    };

    // Calculate subtotal (cart items only)
    const subtotal = getCartTotal();

    // Calculate delivery charge (if subtotal < £10)
    const deliveryCharge = subtotal > 0 && subtotal < 10 ? (parseFloat(deliveryCost) || 0) : 0;
    
    // Calculate total (subtotal + delivery charge)
    const total = subtotal + deliveryCharge;

    const openSpecialOrderModal = (item) => {
        setSelectedSpecialOrderItem(item);
        setSpecialOrderData('menu_item_id', item.id);
        setShowSpecialOrderModal(true);
    };

    const closeSpecialOrderModal = () => {
        setShowSpecialOrderModal(false);
        setSelectedSpecialOrderItem(null);
        resetSpecialOrder();
    };

    const { data: specialOrderData, setData: setSpecialOrderData, post: postSpecialOrder, processing: processingSpecialOrder, errors: specialOrderErrors, reset: resetSpecialOrder } = useForm({
        menu_item_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        special_instructions: '',
        quantity: 1,
    });

    const handleSpecialOrderSubmit = (e) => {
        e.preventDefault();
        postSpecialOrder('/special-orders', {
            onSuccess: () => {
                closeSpecialOrderModal();
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setData('items', cart.map(item => ({
            menu_item_id: item.id,
            quantity: item.quantity,
            menu_item_option_id: item.selectedOption?.id || null,
        })));
        post('/orders', {
            onSuccess: () => {
                clearCart();
                setShowCheckout(false);
            },
        });
    };

    return (
        <Layout auth={auth}>
            <Head>
                <title>Menu - Authentic South Asian Food in Milton Keynes | SpiceLoop</title>
                <meta name="description" content="Browse our full menu of authentic South Asian dishes in Milton Keynes. Order delicious curries, biryanis, breads, and desserts. Home-cooked meals delivered to your door." />
                <meta name="keywords" content="South Asian menu Milton Keynes, Indian food menu Milton Keynes, curry menu Milton Keynes, biryani Milton Keynes, naan bread Milton Keynes, Indian takeaway menu Milton Keynes, food delivery Milton Keynes" />
                <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/menu` : '/menu'} />
                
                {/* Open Graph */}
                <meta property="og:title" content="Menu - Authentic South Asian Food in Milton Keynes | SpiceLoop" />
                <meta property="og:description" content="Browse our full menu of authentic South Asian dishes. Order delicious curries, biryanis, breads, and desserts delivered in Milton Keynes." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== 'undefined' ? `${window.location.origin}/menu` : '/menu'} />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Menu - Authentic South Asian Food in Milton Keynes | SpiceLoop" />
                <meta name="twitter:description" content="Browse our full menu of authentic South Asian dishes. Order delicious curries, biryanis, breads, and desserts delivered in Milton Keynes." />
            </Head>
            
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

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-12 border-2 border-spice-orange rounded-lg focus:ring-2 focus:ring-spice-orange focus:border-spice-orange"
                        />
                        <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="mt-2 text-sm text-gray-600">
                            Found {filteredMenuItems.length} {filteredMenuItems.length === 1 ? 'item' : 'items'} matching "{searchQuery}"
                        </p>
                    )}
                </div>

                {/* Category Tabs */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-4">
                        {mainCategories.map((mainCategory) => {
                            const itemsInCategory = getItemsByMainCategory(mainCategory);
                            const isActive = selectedCategory === mainCategory;
                            
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
                                    {mainCategory}
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
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-spice-orange shadow-lg z-[60]">
                        <div className="max-w-7xl mx-auto px-4 py-3">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</p>
                                    <p className="text-lg font-bold text-spice-maroon">£{total.toFixed(2)}</p>
                                    {deliveryCharge > 0 && (
                                        <p className="text-xs text-gray-500">Inc. delivery £{deliveryCharge.toFixed(2)}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        document.getElementById('cart-sidebar')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="bg-spice-orange hover:bg-spice-gold text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition ml-3 flex-shrink-0"
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
                                {filteredMenuItems.map((item) => {
                                    const isAvailableToday = item.is_available_today !== false; // Default to true if not set
                                    return (
                                    <div 
                                        key={item.id} 
                                        className={`bg-white rounded-lg shadow-md p-6 border border-spice-orange relative ${
                                            !isAvailableToday ? 'opacity-60' : ''
                                        }`}
                                    >
                                        {!isAvailableToday && (
                                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                                                Not Available Today
                                            </div>
                                        )}
                                        <div className={`h-48 rounded mb-4 overflow-hidden bg-gray-200 flex items-center justify-center ${
                                            !isAvailableToday ? 'grayscale' : ''
                                        }`}>
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
                                        <h3 className={`text-xl font-bold mb-2 ${
                                            !isAvailableToday ? 'text-gray-500' : 'text-spice-maroon'
                                        }`}>{item.name}</h3>
                                        <p className={`mb-4 ${
                                            !isAvailableToday ? 'text-gray-400' : 'text-gray-600'
                                        }`}>{item.description}</p>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-2xl font-bold ${
                                                    !isAvailableToday ? 'text-gray-400' : 'text-spice-orange'
                                                }`}>£{item.price}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {isAvailableToday ? (
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="flex-1 bg-spice-orange hover:bg-spice-gold text-white px-4 py-2 rounded-lg font-semibold transition"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => openSpecialOrderModal(item)}
                                                            className="flex-1 bg-spice-maroon hover:bg-spice-red text-white px-4 py-2 rounded-lg font-semibold transition"
                                                        >
                                                            Special Order
                                                        </button>
                                                        <button
                                                            disabled
                                                            className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
                                                        >
                                                            Not Available
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-spice-orange">
                                <p className="text-gray-500 text-lg">
                                    {searchQuery ? (
                                        <>No items found matching "{searchQuery}". {searchQuery && <button onClick={() => setSearchQuery('')} className="text-spice-orange hover:text-spice-maroon underline ml-1">Clear search</button>}</>
                                    ) : (
                                        <>No items found in this category.</>
                                    )}
                                </p>
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
                                        {cart.map((item, index) => {
                                            const itemPrice = item.price || parseFloat(item.price);
                                            const cartItemKey = `${item.id}-${item.selectedOption?.id || 'default'}-${index}`;
                                            return (
                                                <div key={cartItemKey} className="flex justify-between items-center border-b pb-2">
                                                    <div>
                                                        <p className="font-semibold">{item.name}</p>
                                                        {item.selectedOption && (
                                                            <p className="text-sm text-gray-600">Variant: {item.selectedOption.name}</p>
                                                        )}
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                                                                className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                                                            >
                                                                -
                                                            </button>
                                                            <span>{item.quantity}</span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                                                                className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">£{(itemPrice * item.quantity).toFixed(2)}</p>
                                                        <button
                                                            onClick={() => handleRemoveFromCart(index)}
                                                            className="text-red-500 text-sm hover:text-red-700"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="border-t pt-4 mb-4 space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal:</span>
                                            <span>£{subtotal.toFixed(2)}</span>
                                        </div>
                                        {deliveryCharge > 0 && (
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Delivery Charge:</span>
                                                <span>£{deliveryCharge.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {subtotal > 0 && subtotal < 10 && deliveryCharge === 0 && (
                                            <div className="text-xs text-gray-500 italic">
                                                Free delivery on orders over £10
                                            </div>
                                        )}
                                        <div className="flex justify-between text-xl font-bold text-spice-maroon pt-2 border-t">
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
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
                                        <input
                                            type="text"
                                            value={data.customer_address}
                                            onChange={(e) => setData('customer_address', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            placeholder="Street address"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Postcode *</label>
                                        <input
                                            type="text"
                                            value={data.customer_postcode}
                                            onChange={(e) => setData('customer_postcode', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            placeholder="e.g., MK1 1AA"
                                            required
                                        />
                                        {errors.customer_postcode && <p className="text-red-500 text-sm mt-1">{errors.customer_postcode}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Do you have any allergies? *</label>
                                        <textarea
                                            value={data.allergies}
                                            onChange={(e) => setData('allergies', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            rows="3"
                                            placeholder="Please list any allergies or dietary requirements. If none, please type 'None'."
                                            required
                                        />
                                        {errors.allergies && <p className="text-red-500 text-sm mt-1">{errors.allergies}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            rows="3"
                                            placeholder="Any additional notes or special instructions"
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

                {/* Variant Selection Modal */}
                {showVariantModal && selectedItemForVariant && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-spice-maroon">Select Variant</h2>
                                <button
                                    onClick={() => {
                                        setShowVariantModal(false);
                                        setSelectedItemForVariant(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-spice-maroon mb-2">{selectedItemForVariant.name}</h3>
                                <p className="text-gray-600 text-sm">{selectedItemForVariant.description}</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                {selectedItemForVariant.options && selectedItemForVariant.options.length > 0 ? (
                                    selectedItemForVariant.options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleVariantSelect(selectedItemForVariant, option)}
                                            className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-spice-orange hover:bg-orange-50 transition text-left"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-800">{option.name}</span>
                                                <span className="text-lg font-bold text-spice-orange">£{parseFloat(option.price).toFixed(2)}</span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No variants available</p>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    setShowVariantModal(false);
                                    setSelectedItemForVariant(null);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Special Order Modal */}
                {showSpecialOrderModal && selectedSpecialOrderItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-spice-maroon">Special Order Request</h2>
                                <button
                                    onClick={closeSpecialOrderModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-yellow-800 mb-1">Please Note:</p>
                                        <p className="text-sm text-yellow-700">
                                            This item is not available today. Special orders require additional preparation time. 
                                            We will contact you to confirm availability and estimated delivery time. 
                                            Thank you for your patience!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-spice-maroon mb-2">Item Details:</h3>
                                <p className="text-lg font-bold">{selectedSpecialOrderItem.name}</p>
                                <p className="text-gray-600 text-sm mt-1">{selectedSpecialOrderItem.description}</p>
                                <p className="text-spice-orange font-bold mt-2">£{selectedSpecialOrderItem.price}</p>
                            </div>

                            <form onSubmit={handleSpecialOrderSubmit}>
                                <input type="hidden" value={specialOrderData.menu_item_id} readOnly />
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={specialOrderData.quantity}
                                            onChange={(e) => setSpecialOrderData('quantity', parseInt(e.target.value))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            required
                                        />
                                        {specialOrderErrors.quantity && <p className="text-red-500 text-sm mt-1">{specialOrderErrors.quantity}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                                        <input
                                            type="text"
                                            value={specialOrderData.customer_name}
                                            onChange={(e) => setSpecialOrderData('customer_name', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            required
                                        />
                                        {specialOrderErrors.customer_name && <p className="text-red-500 text-sm mt-1">{specialOrderErrors.customer_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            value={specialOrderData.customer_email}
                                            onChange={(e) => setSpecialOrderData('customer_email', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            required
                                        />
                                        {specialOrderErrors.customer_email && <p className="text-red-500 text-sm mt-1">{specialOrderErrors.customer_email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={specialOrderData.customer_phone}
                                            onChange={(e) => setSpecialOrderData('customer_phone', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            required
                                        />
                                        {specialOrderErrors.customer_phone && <p className="text-red-500 text-sm mt-1">{specialOrderErrors.customer_phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                                        <textarea
                                            value={specialOrderData.customer_address}
                                            onChange={(e) => setSpecialOrderData('customer_address', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            rows="3"
                                        />
                                        {specialOrderErrors.customer_address && <p className="text-red-500 text-sm mt-1">{specialOrderErrors.customer_address}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                                        <textarea
                                            value={specialOrderData.special_instructions}
                                            onChange={(e) => setSpecialOrderData('special_instructions', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                            rows="3"
                                            placeholder="Any special requests or dietary requirements..."
                                        />
                                        {specialOrderErrors.special_instructions && <p className="text-red-500 text-sm mt-1">{specialOrderErrors.special_instructions}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={closeSpecialOrderModal}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingSpecialOrder}
                                        className="px-6 py-2 bg-spice-maroon hover:bg-spice-red text-white rounded-lg font-semibold disabled:opacity-50"
                                    >
                                        {processingSpecialOrder ? 'Submitting...' : 'Submit Special Order'}
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

