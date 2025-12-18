import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../../Components/Layout';

export default function CostCalculator({ auth, deliveryCost }) {
    const [ingredients, setIngredients] = useState([{ name: '', cost: '' }]);
    const [packaging, setPackaging] = useState('');
    const [others, setOthers] = useState('');
    
    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', cost: '' }]);
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
    
    const resetCalculator = () => {
        setIngredients([{ name: '', cost: '' }]);
        setPackaging('');
        setOthers('');
    };

    return (
        <Layout auth={auth}>
            <Head title="Cost Calculator - SpiceLoop Admin" />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link 
                        href="/admin/dashboard" 
                        className="text-spice-orange hover:text-spice-maroon inline-flex items-center mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold text-spice-maroon">Cost Calculator</h1>
                    <p className="text-gray-600 mt-2">Calculate the total cost of a menu item</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 border border-spice-orange">
                    {/* Ingredients Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-spice-maroon">Ingredients</h2>
                            <button
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
                                            Ingredient Name
                                        </label>
                                        <input
                                            type="text"
                                            value={ingredient.name}
                                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                            placeholder="e.g., Chicken, Rice, Spices"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spice-orange focus:border-spice-orange"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cost (£)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={ingredient.cost}
                                            onChange={(e) => updateIngredient(index, 'cost', e.target.value)}
                                            placeholder="0.00"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spice-orange focus:border-spice-orange"
                                        />
                                    </div>
                                    {ingredients.length > 1 && (
                                        <div className="flex items-end">
                                            <button
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
                                Packaging Cost (£)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={packaging}
                                onChange={(e) => setPackaging(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spice-orange focus:border-spice-orange"
                            />
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
                                Other Costs (£)
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
                            onClick={resetCalculator}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                        >
                            Reset Calculator
                        </button>
                        <button
                            onClick={() => {
                                const breakdown = `Cost Breakdown:\n` +
                                    `Ingredients: £${ingredients.reduce((sum, ing) => sum + (parseFloat(ing.cost) || 0), 0).toFixed(2)}\n` +
                                    `Packaging: £${(parseFloat(packaging) || 0).toFixed(2)}\n` +
                                    `Delivery: £${(parseFloat(deliveryCost) || 0).toFixed(2)}\n` +
                                    `Others: £${(parseFloat(others) || 0).toFixed(2)}\n` +
                                    `Total: £${totalCost.toFixed(2)}`;
                                navigator.clipboard.writeText(breakdown);
                                alert('Cost breakdown copied to clipboard!');
                            }}
                            className="flex-1 px-6 py-3 bg-spice-maroon text-white rounded-lg hover:bg-spice-red transition font-semibold"
                        >
                            Copy Breakdown
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

