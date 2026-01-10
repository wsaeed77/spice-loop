import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function DeliveryRiderCreate({ auth, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/riders');
    };

    return (
        <Layout auth={auth}>
            <Head title="Create Delivery Rider - SpiceLoop" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Create Delivery Rider</h1>
                    <Link
                        href="/admin/riders"
                        className="text-spice-orange hover:text-spice-maroon"
                    >
                        ← Back to Delivery Riders
                    </Link>
                </div>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-8 border border-spice-orange">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                required
                                placeholder="e.g., John Doe"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                required
                                placeholder="e.g., +44 123 456 7890 or 07857110325"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                />
                                <span className="ml-2 text-sm text-gray-700">Active</span>
                            </label>
                            {errors.is_active && <p className="text-red-500 text-sm mt-1">{errors.is_active}</p>}
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <Link
                                href="/admin/riders"
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold transition disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Rider'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

