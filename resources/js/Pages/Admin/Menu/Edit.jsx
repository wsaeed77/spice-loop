import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Layout from '../../../Components/Layout';

export default function MenuEdit({ auth, menuItem }) {
    // Convert price to string if it's a number
    const formatPrice = (price) => {
        if (price === null || price === undefined) return '';
        return String(price);
    };

    // Initialize form with menuItem data if available
    const { data, setData, put, processing, errors, reset } = useForm({
        name: menuItem?.name || '',
        description: menuItem?.description || '',
        price: menuItem?.price ? formatPrice(menuItem.price) : '',
        image_file: null,
        category: menuItem?.category || '',
        type: menuItem?.type || '', // Internal field - not visible to customers
        dish_type: menuItem?.dish_type || '',
        is_available: menuItem?.is_available !== undefined ? Boolean(menuItem.is_available) : true,
        is_available_today: menuItem?.is_available_today !== undefined ? Boolean(menuItem.is_available_today) : true,
        is_subscription_item: menuItem?.is_subscription_item !== undefined ? Boolean(menuItem.is_subscription_item) : false,
        is_featured: menuItem?.is_featured !== undefined ? Boolean(menuItem.is_featured) : false,
        is_weekend_special: menuItem?.is_weekend_special !== undefined ? Boolean(menuItem.is_weekend_special) : false,
        options: menuItem?.options || [],
    });

    // Add option
    const addOption = () => {
        setData('options', [...data.options, { name: '', price: '' }]);
    };

    // Remove option
    const removeOption = (index) => {
        const newOptions = data.options.filter((_, i) => i !== index);
        setData('options', newOptions);
    };

    // Update option
    const updateOption = (index, field, value) => {
        const newOptions = [...data.options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setData('options', newOptions);
    };

    // Reset form when menuItem changes (e.g., navigating to different item)
    useEffect(() => {
        if (menuItem) {
            reset({
                name: menuItem.name || '',
                description: menuItem.description || '',
                price: formatPrice(menuItem.price),
                image_file: null,
                category: menuItem.category || '',
                type: menuItem.type || '',
                dish_type: menuItem.dish_type || '',
                is_available: menuItem.is_available !== undefined ? Boolean(menuItem.is_available) : true,
                is_available_today: menuItem.is_available_today !== undefined ? Boolean(menuItem.is_available_today) : true,
                is_subscription_item: menuItem.is_subscription_item !== undefined ? Boolean(menuItem.is_subscription_item) : false,
                is_featured: menuItem.is_featured !== undefined ? Boolean(menuItem.is_featured) : false,
                is_weekend_special: menuItem.is_weekend_special !== undefined ? Boolean(menuItem.is_weekend_special) : false,
                options: menuItem.options || [],
            });
        }
    }, [menuItem?.id]); // Re-run when menuItem ID changes

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {};
        // Only use forceFormData if there's a file to upload
        if (data.image_file) {
            options.forceFormData = true;
        }
        put(`/admin/menu/${menuItem.id}`, options);
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

    const types = [
        '',
        'South Asian Cuisine',
        'Fast Food',
        'Sides & Drinks',
        'Dessert',
    ];

    return (
        <Layout auth={auth}>
            <Head title="Edit Menu Item - SpiceLoop" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-spice-maroon mb-2">Edit Menu Item</h1>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/menu"
                            className="text-spice-orange hover:text-spice-maroon"
                        >
                            ← Back to Menu
                        </Link>
                        <Link
                            href={`/admin/menu/${menuItem.id}/calculator`}
                            className="text-spice-orange hover:text-spice-maroon flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Cost Calculator
                        </Link>
                    </div>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Type <span className="text-xs text-gray-500">(Internal - not visible to customers)</span>
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                >
                                    <option value="">Select a type</option>
                                    {types.filter(t => t !== '').map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                                <p className="text-xs text-gray-500 mt-1">This field is used internally to control menu selection behavior.</p>
                            </div>

                            <div>
                                <label htmlFor="dish_type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Dish Type
                                </label>
                                <select
                                    id="dish_type"
                                    value={data.dish_type}
                                    onChange={(e) => setData('dish_type', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                >
                                    <option value="">Select dish type</option>
                                    <option value="Veg">Veg</option>
                                    <option value="Meat">Meat</option>
                                </select>
                                {errors.dish_type && <p className="text-red-500 text-sm mt-1">{errors.dish_type}</p>}
                                <p className="text-xs text-gray-500 mt-1">Required for subscription menu items.</p>
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Options / Variations
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="px-4 py-2 bg-spice-orange hover:bg-spice-gold text-white rounded-lg text-sm font-semibold transition"
                                    >
                                        + Add Option
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mb-4">Add different variations/options for this menu item with their prices.</p>
                                
                                {data.options && data.options.length > 0 ? (
                                    <div className="space-y-4">
                                        {data.options.map((option, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="md:col-span-2">
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Option Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={option.name || ''}
                                                            onChange={(e) => updateOption(index, 'name', e.target.value)}
                                                            placeholder="e.g., 2 Puris, 4 Puris"
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-spice-orange focus:border-spice-orange"
                                                        />
                                                        {errors[`options.${index}.name`] && (
                                                            <p className="text-red-500 text-xs mt-1">{errors[`options.${index}.name`]}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Price (£) *
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={option.price || ''}
                                                                onChange={(e) => updateOption(index, 'price', e.target.value)}
                                                                placeholder="0.00"
                                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-spice-orange focus:border-spice-orange"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(index)}
                                                                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                        {errors[`options.${index}.price`] && (
                                                            <p className="text-red-500 text-xs mt-1">{errors[`options.${index}.price`]}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No options added yet. Click "Add Option" to create variations.</p>
                                )}
                            </div>

                        <div>
                            <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-2">
                                Image
                            </label>
                            {menuItem?.image && !data.image_file && (
                                <div className="mb-3">
                                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                    <img 
                                        src={menuItem.image} 
                                        alt="Current menu item" 
                                        className="max-w-xs h-32 object-cover rounded-lg border border-gray-300"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Upload New Image File</label>
                                <input
                                    type="file"
                                    id="image_file"
                                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                    onChange={(e) => {
                                        setData('image_file', e.target.files[0]);
                                        // Clear the image URL when a new file is selected
                                        if (e.target.files[0]) {
                                            setData('image', '');
                                        }
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-spice-orange focus:border-spice-orange"
                                />
                                {data.image_file && (
                                    <p className="text-sm text-gray-600 mt-2">Selected: {data.image_file.name}</p>
                                )}
                                {errors.image_file && <p className="text-red-500 text-sm mt-1">{errors.image_file}</p>}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Upload an image file (max 2MB). Supported formats: JPEG, PNG, JPG, GIF, WebP. Leave empty to keep current image.</p>
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
                                {processing ? 'Updating...' : 'Update Menu Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

