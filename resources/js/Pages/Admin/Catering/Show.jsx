import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function CateringShow({ auth, cateringRequest, flash }) {
    const { data, setData, patch, processing } = useForm({
        status: cateringRequest?.status || 'pending',
    });

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        patch(`/admin/catering/${cateringRequest.id}/status`, {
            preserveScroll: true,
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            contacted: 'bg-blue-100 text-blue-800',
            confirmed: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    if (!cateringRequest) {
        return (
            <Layout auth={auth}>
                <Head title="Catering Request Not Found - SpiceLoop" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-gray-500">Catering request not found.</p>
                    <Link href="/admin/catering" className="text-spice-orange hover:text-spice-maroon">
                        ← Back to Catering Requests
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout auth={auth}>
            <Head title={`Catering Request #${cateringRequest.id} - SpiceLoop`} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Catering Request #{cateringRequest.id}</h1>
                    <Link
                        href="/admin/catering"
                        className="text-spice-orange hover:text-spice-maroon"
                    >
                        ← Back to Catering Requests
                    </Link>
                </div>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Request Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Contact Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold text-gray-900">{cateringRequest.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">{cateringRequest.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-semibold text-gray-900">{cateringRequest.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Event Details</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Event Type</p>
                                    <p className="font-semibold text-gray-900">{cateringRequest.event_type || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Event Date</p>
                                    <p className="font-semibold text-gray-900">{formatDate(cateringRequest.event_date)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Number of Guests</p>
                                    <p className="font-semibold text-gray-900">{cateringRequest.number_of_guests || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-semibold text-gray-900">{cateringRequest.location || 'N/A'}</p>
                                </div>
                                {cateringRequest.special_requirements && (
                                    <div>
                                        <p className="text-sm text-gray-500">Special Requirements</p>
                                        <p className="font-semibold text-gray-900 whitespace-pre-wrap">{cateringRequest.special_requirements}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="space-y-6">
                        {/* Status Update */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Request Status</h2>
                            <form onSubmit={handleStatusUpdate} className="space-y-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                        Update Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                    >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold transition disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Status'}
                                </button>
                            </form>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Current Status:</p>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(cateringRequest.status)}`}>
                                    {cateringRequest.status.charAt(0).toUpperCase() + cateringRequest.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Request Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Request Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Request ID</p>
                                    <p className="font-semibold text-gray-900">#{cateringRequest.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Submitted</p>
                                    <p className="font-semibold text-gray-900">{formatDateTime(cateringRequest.created_at)}</p>
                                </div>
                                {cateringRequest.updated_at !== cateringRequest.created_at && (
                                    <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="font-semibold text-gray-900">{formatDateTime(cateringRequest.updated_at)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

