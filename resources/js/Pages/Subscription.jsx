import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../Components/Layout';

export default function Subscription({ auth, weeklyCharge, weeklyMenu, flash }) {
    const [selectedItems, setSelectedItems] = useState({});
    const [meatCount, setMeatCount] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        selected_menu_items: {},
    });

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayLabels = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
    };

    const handleItemSelect = (day, option) => {
        const previousSelection = selectedItems[day];
        let newMeatCount = meatCount;

        // Remove previous selection from meat count if it was a meat dish
        if (previousSelection) {
            const prevOption = weeklyMenu[day]?.find(opt => opt.id === previousSelection);
            if (prevOption?.menu_item?.dish_type === 'Non-veg') {
                newMeatCount = Math.max(0, newMeatCount - 1);
            }
        }

        // Add new selection to meat count if it's a meat dish
        if (option.menu_item?.dish_type === 'Non-veg') {
            newMeatCount = newMeatCount + 1;
        }

        // Check if we're exceeding the limit
        if (newMeatCount > 3 && option.menu_item?.dish_type === 'Non-veg') {
            alert('You can only select a maximum of 3 non-veg dishes per week.');
            return;
        }

        const newSelectedItems = {
            ...selectedItems,
            [day]: option.id,
        };

        setSelectedItems(newSelectedItems);
        setMeatCount(newMeatCount);
        setData('selected_menu_items', newSelectedItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate that all days have selections
        const missingDays = days.filter(day => !selectedItems[day]);
        if (missingDays.length > 0) {
            alert(`Please select an option for: ${missingDays.map(d => dayLabels[d]).join(', ')}`);
            return;
        }

        post('/subscription');
    };

    return (
        <Layout auth={auth}>
            <Head>
                <title>Weekly Meal Subscription - Milton Keynes | SpiceLoop</title>
                <meta name="description" content="Subscribe to our weekly meal plan in Milton Keynes. Select your meals daily from Monday to Friday. Fresh, home-cooked South Asian cuisine delivered to your door." />
                <meta name="keywords" content="weekly meal subscription Milton Keynes, meal plan Milton Keynes, weekly food subscription UK, South Asian meal subscription, Indian food subscription Milton Keynes, meal delivery service Milton Keynes" />
                <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/subscription` : '/subscription'} />
                
                {/* Open Graph */}
                <meta property="og:title" content="Weekly Meal Subscription - Milton Keynes | SpiceLoop" />
                <meta property="og:description" content="Subscribe to our weekly meal plan. Select your meals daily from Monday to Friday. Fresh, home-cooked South Asian cuisine delivered in Milton Keynes." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== 'undefined' ? `${window.location.origin}/subscription` : '/subscription'} />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Weekly Meal Subscription - Milton Keynes | SpiceLoop" />
                <meta name="twitter:description" content="Subscribe to our weekly meal plan. Select your meals daily from Monday to Friday. Fresh, home-cooked South Asian cuisine delivered in Milton Keynes." />
            </Head>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-spice-maroon mb-2 text-center">Weekly Subscription</h1>
                <p className="text-lg text-gray-600 mb-8 text-center">Single serving meal including 2 roti or bowl of rice</p>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Weekly Menu */}
                    <div>
                        <h2 className="text-2xl font-bold text-spice-maroon mb-4">Weekly Menu Options</h2>
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            {weeklyMenu && Object.keys(weeklyMenu).length > 0 ? (
                                <div className="space-y-4">
                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> You can select a maximum of <strong>3 non-veg dishes</strong> per week.
                                        </p>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Selected non-veg dishes: <strong>{meatCount}/3</strong>
                                        </p>
                                    </div>
                                    {days.map((day) => (
                                        <div key={day} className="border-b pb-4 last:border-0">
                                            <h3 className="font-bold text-spice-maroon mb-3">{dayLabels[day]} *</h3>
                                            <div className="space-y-2">
                                                {weeklyMenu[day]?.map((option, index) => (
                                                    <div key={option.id}>
                                                        {index > 0 && (
                                                            <div className="text-sm font-semibold text-spice-maroon my-2 text-left">OR</div>
                                                        )}
                                                        <label className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                            <input
                                                                type="radio"
                                                                name={`day_${day}`}
                                                                value={option.id}
                                                                checked={selectedItems[day] === option.id}
                                                                onChange={() => handleItemSelect(day, option)}
                                                                className="mt-1 mr-3"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="text-gray-700 font-medium">
                                                                    {option.menu_item?.name}
                                                                </div>
                                                                {option.menu_item?.dish_type && (
                                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                                        option.menu_item.dish_type === 'Non-veg' 
                                                                            ? 'bg-red-100 text-red-700' 
                                                                            : 'bg-green-100 text-green-700'
                                                                    }`}>
                                                                        {option.menu_item.dish_type}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors[`selected_menu_items.${day}`] && (
                                                <p className="text-red-500 text-sm mt-1">{errors[`selected_menu_items.${day}`]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Weekly menu will be available soon.</p>
                            )}
                        </div>
                    </div>

                    {/* Subscription Form */}
                    <div>
                        <div className="bg-spice-orange text-white p-4 rounded-t-lg">
                            <h2 className="text-2xl font-bold">Subscribe Now</h2>
                            <p className="text-lg">Weekly Charge: £{typeof weeklyCharge === 'number' ? weeklyCharge.toFixed(2) : parseFloat(weeklyCharge || '50.00').toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-b-lg shadow-md p-6 border border-spice-orange">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        required
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        rows="3"
                                        required
                                    />
                                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        required
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-spice-orange hover:bg-spice-gold text-white py-3 rounded-lg font-semibold transition"
                                >
                                    {processing ? 'Submitting...' : 'Submit Subscription Request'}
                                </button>
                            </form>
                            <p className="text-sm text-gray-500 mt-4 text-center">
                                After submission, we will contact you to set up your account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

