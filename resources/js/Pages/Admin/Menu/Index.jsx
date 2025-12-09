import { Head, Link, router } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function MenuIndex({ auth, menuItems, flash }) {
    const handleDelete = (id, e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
            router.delete(`/admin/menu/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Success message will come from flash
                },
                onError: (errors) => {
                    alert('Error deleting menu item: ' + (errors.message || 'Please try again.'));
                }
            });
        }
    };

    return (
        <Layout auth={auth}>
            <Head title="Manage Menu - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon">Manage Menu</h1>
                    <Link
                        href="/admin/menu/create"
                        className="bg-spice-orange hover:bg-spice-gold text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        + Add New Item
                    </Link>
                </div>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md border border-spice-orange overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-spice-cream">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Subscription</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {menuItems && menuItems.length > 0 ? (
                                    menuItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                {item.description && (
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{item.category || 'Uncategorized'}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-spice-orange">${parseFloat(item.price).toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.is_available 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.is_available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.is_subscription_item 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {item.is_subscription_item ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    href={`/admin/menu/${item.id}/edit`}
                                                    className="text-spice-orange hover:text-spice-maroon mr-4"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDelete(item.id, e)}
                                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No menu items found. <Link href="/admin/menu/create" className="text-spice-orange hover:text-spice-maroon">Create one now</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6">
                    <Link
                        href="/admin/dashboard"
                        className="text-spice-orange hover:text-spice-maroon"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

