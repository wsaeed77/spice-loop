import { Head, Link, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function DeliveryRidersIndex({ auth, riders, flash }) {
    const handleDelete = (riderId) => {
        if (confirm('Are you sure you want to delete this delivery rider?')) {
            router.delete(`/admin/riders/${riderId}`);
        }
    };

    return (
        <Layout auth={auth}>
            <Head title="Manage Delivery Riders - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-spice-maroon mb-2">Manage Delivery Riders</h1>
                        <Link
                            href="/admin/dashboard"
                            className="text-spice-orange hover:text-spice-maroon"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <Link
                        href="/admin/riders/create"
                        className="px-4 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold transition"
                    >
                        + Add New Rider
                    </Link>
                </div>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                {flash?.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {flash.error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md border border-spice-orange overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-spice-cream">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {riders && riders.length > 0 ? (
                                    riders.map((rider) => (
                                        <tr key={rider.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{rider.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    rider.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {rider.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <Link
                                                        href={`/admin/riders/${rider.id}/edit`}
                                                        className="text-spice-orange hover:text-spice-maroon"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(rider.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No delivery riders found. <Link href="/admin/riders/create" className="text-spice-orange hover:text-spice-maroon">Add your first rider</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

