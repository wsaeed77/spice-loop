import { Head, useForm } from '@inertiajs/react';
import Layout from '../Components/Layout';

export default function Catering({ auth, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        event_type: '',
        event_date: '',
        number_of_guests: '',
        location: '',
        special_requirements: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/catering');
    };

    return (
        <Layout auth={auth}>
            <Head title="Catering - SpiceLoop" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-spice-maroon text-white p-6 rounded-t-lg text-center">
                    <h1 className="text-4xl font-bold mb-2">PARTY & CATERING ORDERS</h1>
                    <p className="text-lg">For all your special events. Book now!</p>
                </div>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 mt-6">
                        {flash.message}
                    </div>
                )}

                <div className="bg-white rounded-b-lg shadow-md p-8 border border-spice-orange">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                                <input
                                    type="text"
                                    value={data.event_type}
                                    onChange={(e) => setData('event_type', e.target.value)}
                                    placeholder="e.g., Wedding, Birthday, Corporate"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    required
                                />
                                {errors.event_type && <p className="text-red-500 text-sm mt-1">{errors.event_type}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                                <input
                                    type="date"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    required
                                />
                                {errors.event_date && <p className="text-red-500 text-sm mt-1">{errors.event_date}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
                            <input
                                type="number"
                                value={data.number_of_guests}
                                onChange={(e) => setData('number_of_guests', e.target.value)}
                                min="1"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                required
                            />
                            {errors.number_of_guests && <p className="text-red-500 text-sm mt-1">{errors.number_of_guests}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                            <textarea
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                rows="3"
                                required
                            />
                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                            <textarea
                                value={data.special_requirements}
                                onChange={(e) => setData('special_requirements', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                rows="4"
                                placeholder="Any dietary restrictions, preferences, or special requests..."
                            />
                            {errors.special_requirements && <p className="text-red-500 text-sm mt-1">{errors.special_requirements}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-spice-orange hover:bg-spice-gold text-white py-3 rounded-lg font-semibold transition"
                        >
                            {processing ? 'Submitting...' : 'Submit Catering Request'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

