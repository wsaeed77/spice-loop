import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function SettingsIndex({ auth, settings, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        weekly_menu_price: settings.weekly_menu_price || '50.00',
        contact_phone: settings.contact_phone || '',
        whatsapp_number: settings.whatsapp_number || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.settings.update'));
    };

    return (
        <Layout auth={auth}>
            <Head title="Settings - SpiceLoop" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Settings</h1>
                    <Link
                        href={route('admin.dashboard')}
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

                <div className="bg-white rounded-lg shadow-md p-8 border border-spice-orange">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Weekly Menu Price */}
                        <div>
                            <label htmlFor="weekly_menu_price" className="block text-sm font-medium text-gray-700 mb-2">
                                Weekly Menu Price (£)
                            </label>
                            <input
                                type="number"
                                id="weekly_menu_price"
                                step="0.01"
                                min="0"
                                value={data.weekly_menu_price}
                                onChange={(e) => setData('weekly_menu_price', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">This price will be shown on the subscription page and homepage.</p>
                            {errors.weekly_menu_price && <p className="text-red-500 text-sm mt-1">{errors.weekly_menu_price}</p>}
                        </div>

                        {/* Contact Phone */}
                        <div>
                            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Phone Number
                            </label>
                            <input
                                type="text"
                                id="contact_phone"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                                placeholder="e.g., +44 123 456 7890"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                            />
                            <p className="mt-1 text-sm text-gray-500">This phone number will be displayed in the header and footer of the website.</p>
                            {errors.contact_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>}
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                            <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 mb-2">
                                WhatsApp Number
                            </label>
                            <input
                                type="text"
                                id="whatsapp_number"
                                value={data.whatsapp_number}
                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                placeholder="e.g., 441234567890 (without + or spaces)"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                            />
                            <p className="mt-1 text-sm text-gray-500">Enter your WhatsApp number without country code prefix (e.g., 441234567890). This will be used for the floating WhatsApp chat widget.</p>
                            {errors.whatsapp_number && <p className="text-red-500 text-sm mt-1">{errors.whatsapp_number}</p>}
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <Link
                                href={route('admin.dashboard')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-medium disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

