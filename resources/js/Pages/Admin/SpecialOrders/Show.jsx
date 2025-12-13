import { Head, Link, useForm, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function SpecialOrderShow({ auth, specialOrder, flash }) {
    const { data, setData, patch, processing, errors } = useForm({
        status: specialOrder.status || 'pending',
        admin_notes: specialOrder.admin_notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.special-orders.update-status', specialOrder.id));
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-purple-100 text-purple-800',
            ready: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || colors.pending;
    };

    return (
        <Layout auth={auth}>
            <Head title={`Special Order #${specialOrder.id} - SpiceLoop`} />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link
                        href={route('admin.special-orders.index')}
                        className="text-spice-orange hover:text-spice-maroon mb-4 inline-block"
                    >
                        ← Back to Special Orders
                    </Link>
                    <h1 className="text-4xl font-bold text-spice-maroon">Special Order #{specialOrder.id}</h1>
                </div>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md border border-spice-orange p-8 space-y-6">
                    {/* Order Status */}
                    <div className="flex items-center justify-between pb-4 border-b">
                        <div>
                            <h2 className="text-xl font-semibold text-spice-maroon mb-2">Order Status</h2>
                            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(specialOrder.status)}`}>
                                {specialOrder.status.charAt(0).toUpperCase() + specialOrder.status.slice(1)}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            <div>Created: {new Date(specialOrder.created_at).toLocaleString()}</div>
                            {specialOrder.updated_at !== specialOrder.created_at && (
                                <div>Updated: {new Date(specialOrder.updated_at).toLocaleString()}</div>
                            )}
                        </div>
                    </div>

                    {/* Menu Item */}
                    <div>
                        <h2 className="text-xl font-semibold text-spice-maroon mb-3">Menu Item</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-lg font-bold">{specialOrder.menu_item?.name}</p>
                            <p className="text-gray-600 mt-1">{specialOrder.menu_item?.description}</p>
                            <p className="text-spice-orange font-bold mt-2">£{specialOrder.menu_item?.price}</p>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div>
                        <h2 className="text-xl font-semibold text-spice-maroon mb-3">Customer Information</h2>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div>
                                <span className="font-semibold">Name:</span> {specialOrder.customer_name}
                            </div>
                            <div>
                                <span className="font-semibold">Email:</span>{' '}
                                <a href={`mailto:${specialOrder.customer_email}`} className="text-spice-orange hover:text-spice-maroon">
                                    {specialOrder.customer_email}
                                </a>
                            </div>
                            <div>
                                <span className="font-semibold">Phone:</span>{' '}
                                <a href={`tel:${specialOrder.customer_phone}`} className="text-spice-orange hover:text-spice-maroon">
                                    {specialOrder.customer_phone}
                                </a>
                            </div>
                            {specialOrder.customer_address && (
                                <div>
                                    <span className="font-semibold">Address:</span> {specialOrder.customer_address}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div>
                        <h2 className="text-xl font-semibold text-spice-maroon mb-3">Order Details</h2>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div>
                                <span className="font-semibold">Quantity:</span> {specialOrder.quantity}
                            </div>
                            {specialOrder.special_instructions && (
                                <div>
                                    <span className="font-semibold">Special Instructions:</span>
                                    <p className="mt-1 text-gray-700">{specialOrder.special_instructions}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Update Status Form */}
                    <div>
                        <h2 className="text-xl font-semibold text-spice-maroon mb-3">Update Order Status</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="ready">Ready</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Admin Notes
                                </label>
                                <textarea
                                    value={data.admin_notes}
                                    onChange={(e) => setData('admin_notes', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                    rows="4"
                                    placeholder="Add any notes about this order..."
                                />
                                {errors.admin_notes && <p className="text-red-500 text-sm mt-1">{errors.admin_notes}</p>}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

