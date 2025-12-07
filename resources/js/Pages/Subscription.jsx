import { Head, useForm } from '@inertiajs/react';
import Layout from '../Components/Layout';

export default function Subscription({ auth, weeklyCharge, weeklyMenu, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
    });

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayLabels = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/subscription');
    };

    return (
        <Layout auth={auth}>
            <Head title="Subscription - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-spice-maroon mb-8 text-center">Weekly Subscription</h1>

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
                                    {days.map((day) => (
                                        <div key={day} className="border-b pb-4 last:border-0">
                                            <h3 className="font-bold text-spice-maroon mb-2">{dayLabels[day]}</h3>
                                            {weeklyMenu[day]?.map((option) => (
                                                <div key={option.id} className="text-gray-600 ml-4">
                                                    • {option.menu_item?.name}
                                                </div>
                                            ))}
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
                            <p className="text-lg">Weekly Charge: ${weeklyCharge?.toFixed(2) || '50.00'}</p>
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

