import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function SettingsIndex({ auth, settings, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        weekly_menu_price: settings.weekly_menu_price || '50.00',
        delivery_cost: settings.delivery_cost || '0.00',
        max_non_veg_dishes: settings.max_non_veg_dishes || '3',
        contact_phone: settings.contact_phone || '',
        whatsapp_number: settings.whatsapp_number || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
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

                        {/* Delivery Cost */}
                        <div>
                            <label htmlFor="delivery_cost" className="block text-sm font-medium text-gray-700 mb-2">
                                Delivery Cost (£)
                            </label>
                            <input
                                type="number"
                                id="delivery_cost"
                                step="0.01"
                                min="0"
                                value={data.delivery_cost}
                                onChange={(e) => setData('delivery_cost', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">Fixed delivery cost used in the cost calculator. This will be automatically included when calculating menu item costs.</p>
                            {errors.delivery_cost && <p className="text-red-500 text-sm mt-1">{errors.delivery_cost}</p>}
                        </div>

                        {/* Max Non-Veg Dishes */}
                        <div>
                            <label htmlFor="max_non_veg_dishes" className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Non-Veg Dishes Per Week
                            </label>
                            <input
                                type="number"
                                id="max_non_veg_dishes"
                                step="1"
                                min="0"
                                max="5"
                                value={data.max_non_veg_dishes}
                                onChange={(e) => setData('max_non_veg_dishes', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">Maximum number of non-veg dishes that can be selected in a weekly subscription (0-5).</p>
                            {errors.max_non_veg_dishes && <p className="text-red-500 text-sm mt-1">{errors.max_non_veg_dishes}</p>}
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

                        {/* Social Media Links */}
                        <div className="border-t border-gray-200 pt-6 mt-6">
                            <h2 className="text-xl font-semibold text-spice-maroon mb-4">Social Media Links</h2>
                            
                            {/* Facebook URL */}
                            <div className="mb-4">
                                <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700 mb-2">
                                    Facebook Page URL
                                </label>
                                <input
                                    type="url"
                                    id="facebook_url"
                                    value={data.facebook_url}
                                    onChange={(e) => setData('facebook_url', e.target.value)}
                                    placeholder="https://www.facebook.com/yourpage"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                />
                                <p className="mt-1 text-sm text-gray-500">Enter your full Facebook page URL. This will be displayed as an icon in the footer.</p>
                                {errors.facebook_url && <p className="text-red-500 text-sm mt-1">{errors.facebook_url}</p>}
                            </div>

                            {/* Instagram URL */}
                            <div>
                                <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700 mb-2">
                                    Instagram Profile URL
                                </label>
                                <input
                                    type="url"
                                    id="instagram_url"
                                    value={data.instagram_url}
                                    onChange={(e) => setData('instagram_url', e.target.value)}
                                    placeholder="https://www.instagram.com/yourprofile"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                />
                                <p className="mt-1 text-sm text-gray-500">Enter your full Instagram profile URL. This will be displayed as an icon in the footer.</p>
                                {errors.instagram_url && <p className="text-red-500 text-sm mt-1">{errors.instagram_url}</p>}
                            </div>
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

