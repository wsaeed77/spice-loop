import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '../../../Components/Layout';

export default function MenuItemCalculator({ auth, menuItem, calculator, deliveryCost, flash }) {
    const [ingredients, setIngredients] = useState(
        calculator?.ingredients && calculator.ingredients.length > 0
            ? calculator.ingredients.map(ing => ({ ...ing, quantity: ing.quantity || '' }))
            : [{ name: '', cost: '', quantity: '' }]
    );
    const [packaging, setPackaging] = useState(calculator?.packaging_cost || '');
    const [others, setOthers] = useState(calculator?.others_cost || '');
    
    const { data, setData, post, processing, errors, delete: destroy } = useForm({
        ingredients: ingredients,
        packaging_cost: packaging,
        delivery_cost: deliveryCost,
        others_cost: others,
    });

    // Update form data when local state changes
    useEffect(() => {
        setData({
            ingredients: ingredients,
            packaging_cost: packaging,
            delivery_cost: deliveryCost,
            others_cost: others,
        });
    }, [ingredients, packaging, others, deliveryCost]);

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', cost: '', quantity: '' }]);
    };
    
    const removeIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };
    
    const updateIngredient = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };
    
    const calculateTotal = () => {
        const ingredientsTotal = ingredients.reduce((sum, ing) => {
            const cost = parseFloat(ing.cost) || 0;
            return sum + cost;
        }, 0);
        
        const packagingCost = parseFloat(packaging) || 0;
        const deliveryCostValue = parseFloat(deliveryCost) || 0;
        const othersCost = parseFloat(others) || 0;
        
        return ingredientsTotal + packagingCost + deliveryCostValue + othersCost;
    };
    
    const totalCost = calculateTotal();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/menu/${menuItem.id}/calculator`, {
            onSuccess: () => {
                // Success message is handled by flash
            },
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete the calculator data for this menu item?')) {
            destroy(`/admin/menu/${menuItem.id}/calculator`, {
                onSuccess: () => {
                    setIngredients([{ name: '', cost: '' }]);
                    setPackaging('');
                    setOthers('');
                },
            });
        }
    };

    const resetCalculator = () => {
        setIngredients([{ name: '', cost: '', quantity: '' }]);
        setPackaging('');
        setOthers('');
    };

    return (
        <Layout auth={auth}>
            <Head title={`Cost Calculator - ${menuItem.name} - SpiceLoop Admin`} />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link 
                        href="/admin/menu" 
                        className="text-spice-orange hover:text-spice-maroon inline-flex items-center mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Menu
                    </Link>
                    <h1 className="text-4xl font-bold text-spice-maroon">Cost Calculator</h1>
                    <p className="text-gray-600 mt-2">Calculate the total cost for: <span className="font-semibold text-spice-maroon">{menuItem.name}</span></p>
                </div>

                {flash?.message && (
                    <div className={`mb-6 px-4 py-3 rounded-lg ${
                        flash.message.includes('deleted') 
                            ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
                            : 'bg-green-100 border border-green-400 text-green-700'
                    }`}>
                        {flash.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-lg p-8 border border-spice-orange">
                        {/* Ingredients Section */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-spice-maroon">Ingredients</h2>
                                <button
                                    type="button"
                                    onClick={addIngredient}
                                    className="bg-spice-orange text-white px-4 py-2 rounded-lg hover:bg-spice-gold transition flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Ingredient
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ingredient Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={ingredient.name}
                                                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                                placeholder="e.g., Chicken, Rice, Spices"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spice-orange focus:border-spice-orange"
                                                required
                                            />
                                            {errors[`ingredients.${index}.name`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`ingredients.${index}.name`]}</p>
                                            )}
                                        </div>
                                        <div className="w-32">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quantity <span className="text-gray-500 text-xs">(optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={ingredient.quantity || ''}
                                                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                                                placeholder="e.g., 500g, 2 cups"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spice-orange focus:border-spice-orange"
                                            />
                                            {errors[`ingredients.${index}.quantity`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`ingredients.${index}.quantity`]}</p>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cost (£) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={ingredient.cost}
                                                onChange={(e) => updateIngredient(index, 'cost', e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spice-orange focus:border-spice-orange"
                                                required
                                            />
                                            {errors[`ingredients.${index}.cost`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`ingredients.${index}.cost`]}</p>
                                            )}
                                        </div>
                                        {ingredients.length > 1 && (
                                            <div className="flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeIngredient(index)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4 text-right">
                                <p className="text-sm text-gray-600">
                                    Ingredients Total: <span className="font-semibold text-spice-maroon">£{ingredients.reduce((sum, ing) => sum + (parseFloat(ing.cost) || 0), 0).toFixed(2)}</span>
                                </p>
                            </div>
                        </div>

                        {/* Packaging Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Packaging</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Packaging Cost (£) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={packaging}
                                    onChange={(e) => setPackaging(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spice-orange focus:border-spice-orange"
                                    required
                                />
                                {errors.packaging_cost && <p className="text-red-500 text-xs mt-1">{errors.packaging_cost}</p>}
                            </div>
                        </div>

                        {/* Delivery Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Delivery</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Delivery Cost (£) <span className="text-gray-500 text-xs">(Fixed from settings)</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={deliveryCost}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Update this value in <Link href="/admin/settings" className="text-spice-orange hover:underline">Settings</Link>
                                </p>
                            </div>
                        </div>

                        {/* Others Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-spice-maroon mb-4">Others</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Other Costs (£) <span className="text-gray-500 text-xs">(optional)</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={others}
                                    onChange={(e) => setOthers(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spice-orange focus:border-spice-orange"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Additional costs (labor, overhead, etc.)
                                </p>
                                {errors.others_cost && <p className="text-red-500 text-xs mt-1">{errors.others_cost}</p>}
                            </div>
                        </div>

                        {/* Total Cost Display */}
                        <div className="bg-gradient-to-r from-spice-orange to-spice-gold rounded-xl p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">Total Cost</h3>
                                    <p className="text-white/90 text-sm">All costs combined</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-bold text-white">£{totalCost.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-spice-maroon mb-4">Cost Breakdown</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Ingredients:</span>
                                    <span className="font-semibold">£{ingredients.reduce((sum, ing) => sum + (parseFloat(ing.cost) || 0), 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Packaging:</span>
                                    <span className="font-semibold">£{(parseFloat(packaging) || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery:</span>
                                    <span className="font-semibold">£{(parseFloat(deliveryCost) || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Others:</span>
                                    <span className="font-semibold">£{(parseFloat(others) || 0).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold text-spice-maroon">
                                    <span>Total:</span>
                                    <span>£{totalCost.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={resetCalculator}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                Reset
                            </button>
                            {calculator && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                                >
                                    Delete Saved Data
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-spice-maroon text-white rounded-lg hover:bg-spice-red transition font-semibold disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Calculator'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

