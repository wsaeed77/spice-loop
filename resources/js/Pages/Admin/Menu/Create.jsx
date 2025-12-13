import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../../../Components/Layout';

export default function MenuCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        image_file: null,
        category: '',
        is_available: true,
        is_available_today: true,
        is_subscription_item: false,
        is_featured: false,
        is_weekend_special: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/menu', {
            forceFormData: true,
        });
    };

    const categories = [
        'Curries',
        'Rice Dishes',
        'Breads',
        'Appetizers',
        'Desserts',
        'Beverages',
        'Vegetarian',
        'Non-Vegetarian',
    ];

    return (
        <Layout auth={auth}>
            <Head title="Create Menu Item - SpiceLoop" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Create Menu Item</h1>
                    <Link
                        href="/admin/menu"
                        className="text-spice-orange hover:text-spice-maroon"
                    >
                        ← Back to Menu
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 border border-spice-orange">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Item Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows="4"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (£) *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                    required
                                />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-2">
                                Image
                            </label>
                            <div>
                                <input
                                    type="file"
                                    id="image_file"
                                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                    onChange={(e) => setData('image_file', e.target.files[0])}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                />
                                {data.image_file && (
                                    <p className="text-sm text-gray-600 mt-2">Selected: {data.image_file.name}</p>
                                )}
                                {errors.image_file && <p className="text-red-500 text-sm mt-1">{errors.image_file}</p>}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Upload an image file (max 2MB). Supported formats: JPEG, PNG, JPG, GIF, WebP.</p>
                        </div>

                        <div className="flex items-center space-x-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_available}
                                    onChange={(e) => setData('is_available', e.target.checked)}
                                    className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                />
                                <span className="ml-2 text-sm text-gray-700">Available for ordering</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_available_today}
                                    onChange={(e) => setData('is_available_today', e.target.checked)}
                                    className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                />
                                <span className="ml-2 text-sm text-gray-700">Available today</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_subscription_item}
                                    onChange={(e) => setData('is_subscription_item', e.target.checked)}
                                    className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                />
                                <span className="ml-2 text-sm text-gray-700">Include in subscription menu</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                />
                                <span className="ml-2 text-sm text-gray-700">Feature on homepage (Chef's Specials)</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_weekend_special}
                                    onChange={(e) => setData('is_weekend_special', e.target.checked)}
                                    className="rounded border-gray-300 text-spice-orange focus:ring-spice-orange"
                                />
                                <span className="ml-2 text-sm text-gray-700">Weekend Special (Featured banner)</span>
                            </label>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <Link
                                href="/admin/menu"
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg font-semibold transition disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Menu Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

