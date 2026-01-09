import { Head, useForm } from '@inertiajs/react';
import Layout from '../Components/Layout';

export default function ContactSubscription({ auth, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        phone: '',
        name: '',
        address: '',
        postcode: '',
        allow_promotions: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact-subscription', {
            onSuccess: () => {
                // Clear the form after successful submission
                reset();
            },
        });
    };

    return (
        <Layout auth={auth}>
            <Head>
                <title>Subscribe for Updates - SpiceLoop</title>
                <meta name="description" content="Subscribe to receive SMS and WhatsApp updates about promotions and menu updates from SpiceLoop." />
            </Head>
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-spice-maroon text-white p-6 rounded-t-lg text-center">
                    <h1 className="text-4xl font-bold mb-2">SUBSCRIBE FOR UPDATES</h1>
                    <p className="text-lg">Stay connected with our latest promotions and menu updates</p>
                </div>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 mt-6">
                        {flash.message}
                    </div>
                )}

                <div className="bg-white rounded-b-lg shadow-md p-8 border border-spice-orange">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                required
                                placeholder="e.g., +44 123 456 7890"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                placeholder="Your name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows="3"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                placeholder="Street address"
                            />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                                Postcode
                            </label>
                            <input
                                type="text"
                                id="postcode"
                                value={data.postcode}
                                onChange={(e) => setData('postcode', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                placeholder="e.g., MK1 1AA"
                            />
                            {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>}
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    checked={data.allow_promotions}
                                    onChange={(e) => setData('allow_promotions', e.target.checked)}
                                    className="mt-1 rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                />
                                <div className="ml-3">
                                    <span className="text-sm font-medium text-gray-700">Allow SMS and WhatsApp for promotions and menu updates</span>
                                    <p className="text-xs text-gray-500 mt-1">Receive promotional offers and menu updates via SMS and WhatsApp</p>
                                </div>
                            </label>
                            {errors.allow_promotions && <p className="text-red-500 text-sm mt-1 ml-7">{errors.allow_promotions}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-spice-orange hover:bg-spice-gold text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                        >
                            {processing ? 'Submitting...' : 'Subscribe'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

