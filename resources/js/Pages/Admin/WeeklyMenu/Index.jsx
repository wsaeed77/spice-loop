import { Head, Link, router, useForm } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function WeeklyMenuIndex({ auth, weeklyMenu, menuItems, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        menu_item_id: '',
        day_of_week: 'monday',
        is_available: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/weekly-menu', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this item from the weekly menu?')) {
            router.delete(`/admin/weekly-menu/${id}`, {
                preserveScroll: true,
                onError: (errors) => {
                    alert('Failed to delete: ' + (errors.message || 'Unknown error'));
                },
            });
        }
    };

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayLabels = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
    };

    return (
        <Layout auth={auth}>
            <Head title="Weekly Subscription Menu - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Weekly Subscription Menu</h1>
                    <Link
                        href="/admin/dashboard"
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add Menu Item Form */}
                    <div className="bg-white rounded-lg shadow-md p-8 border border-spice-orange">
                        <h2 className="text-2xl font-bold text-spice-maroon mb-6">Add Menu Item to Weekly Menu</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="menu_item_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Menu Item *
                                </label>
                                <select
                                    id="menu_item_id"
                                    value={data.menu_item_id}
                                    onChange={(e) => setData('menu_item_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                    required
                                >
                                    <option value="">Select a menu item</option>
                                    {menuItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} - ${item.price}
                                        </option>
                                    ))}
                                </select>
                                {errors.menu_item_id && <p className="text-red-500 text-sm mt-1">{errors.menu_item_id}</p>}
                            </div>

                            <div>
                                <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 mb-2">
                                    Day of Week *
                                </label>
                                <select
                                    id="day_of_week"
                                    value={data.day_of_week}
                                    onChange={(e) => setData('day_of_week', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                    required
                                >
                                    {days.map((day) => (
                                        <option key={day} value={day}>
                                            {dayLabels[day]}
                                        </option>
                                    ))}
                                </select>
                                {errors.day_of_week && <p className="text-red-500 text-sm mt-1">{errors.day_of_week}</p>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_available"
                                    checked={data.is_available}
                                    onChange={(e) => setData('is_available', e.target.checked)}
                                    className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                />
                                <label htmlFor="is_available" className="ml-2 text-sm text-gray-700">
                                    Available for selection
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold transition disabled:opacity-50"
                            >
                                {processing ? 'Adding...' : 'Add to Weekly Menu'}
                            </button>
                        </form>
                    </div>

                    {/* Weekly Menu Display */}
                    <div className="bg-white rounded-lg shadow-md p-8 border border-spice-orange">
                        <h2 className="text-2xl font-bold text-spice-maroon mb-6">Current Weekly Menu</h2>
                        {weeklyMenu && Object.keys(weeklyMenu).length > 0 ? (
                            <div className="space-y-4">
                                {days.map((day) => (
                                    <div key={day} className="border-b pb-4 last:border-0">
                                        <h3 className="font-bold text-spice-maroon mb-2">{dayLabels[day]}</h3>
                                        {weeklyMenu[day] && weeklyMenu[day].length > 0 ? (
                                            <div className="space-y-2">
                                                {weeklyMenu[day].map((option) => (
                                                    <div key={option.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-gray-600">
                                                                {option.menu_item?.name || 'Unknown Item'}
                                                            </span>
                                                            {!option.is_available && (
                                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                                    Unavailable
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(option.id)}
                                                            className="text-red-600 hover:text-red-900 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-sm">No items for this day</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No weekly menu items set yet. Add items using the form on the left.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

