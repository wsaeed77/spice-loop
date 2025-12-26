import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function ContactEdit({ auth, contact }) {
    const { data, setData, put, processing, errors } = useForm({
        phone: contact.phone || '',
        name: contact.name || '',
        email: contact.email || '',
        address: contact.address || '',
        postcode: contact.postcode || '',
        is_existing_customer: contact.is_existing_customer || false,
        allow_sms_promotions: contact.allow_sms_promotions || false,
        allow_whatsapp_promotions: contact.allow_whatsapp_promotions || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/contacts/${contact.id}`);
    };

    return (
        <Layout auth={auth}>
            <Head title="Edit Contact - SpiceLoop" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Edit Contact</h1>
                    <Link
                        href="/admin/contacts"
                        className="text-spice-orange hover:text-spice-maroon"
                    >
                        ← Back to Contacts
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 border border-spice-orange">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                placeholder="e.g., +44 123 456 7890"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                placeholder="Customer name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                placeholder="customer@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
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
                            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
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

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_existing_customer}
                                        onChange={(e) => setData('is_existing_customer', e.target.checked)}
                                        className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Existing Customer</span>
                                </label>
                                {errors.is_existing_customer && <p className="text-red-500 text-sm mt-1">{errors.is_existing_customer}</p>}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Communication Permissions</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.allow_sms_promotions}
                                            onChange={(e) => setData('allow_sms_promotions', e.target.checked)}
                                            className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Allow SMS Promotions</span>
                                    </label>
                                    {errors.allow_sms_promotions && <p className="text-red-500 text-sm mt-1">{errors.allow_sms_promotions}</p>}

                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.allow_whatsapp_promotions}
                                            onChange={(e) => setData('allow_whatsapp_promotions', e.target.checked)}
                                            className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Allow WhatsApp Promotions</span>
                                    </label>
                                    {errors.allow_whatsapp_promotions && <p className="text-red-500 text-sm mt-1">{errors.allow_whatsapp_promotions}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <Link
                                href="/admin/contacts"
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold transition disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Contact'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

