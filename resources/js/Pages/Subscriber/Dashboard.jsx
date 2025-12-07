import { Head, useForm } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function SubscriberDashboard({ auth, availableItems, todaySelection, upcomingSelections, canSelectToday, tomorrow, flash }) {
    const { data, setData, post, processing } = useForm({
        menu_item_id: '',
        selection_date: tomorrow,
    });

    const handleSelect = (itemId) => {
        setData('menu_item_id', itemId);
        post('/subscriber/select-item', {
            onSuccess: () => {
                setData('menu_item_id', '');
            },
        });
    };

    return (
        <Layout auth={auth}>
            <Head title="Subscriber Dashboard - SpiceLoop" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-spice-maroon mb-8">My Dashboard</h1>

                {flash?.message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {flash.message}
                    </div>
                )}

                {/* Today's Selection */}
                {todaySelection && (
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange mb-8">
                        <h2 className="text-2xl font-bold text-spice-maroon mb-4">Today's Selection</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-semibold">{todaySelection.menu_item?.name}</p>
                                <p className="text-gray-600">{new Date(todaySelection.selection_date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded ${
                                todaySelection.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {todaySelection.status}
                            </span>
                        </div>
                    </div>
                )}

                {/* Select for Tomorrow */}
                {canSelectToday && (
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange mb-8">
                        <h2 className="text-2xl font-bold text-spice-maroon mb-4">Select Meal for Tomorrow</h2>
                        {availableItems && availableItems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {availableItems.map((item) => (
                                    <div key={item.id} className="border border-spice-orange rounded-lg p-4">
                                        <h3 className="font-semibold text-spice-maroon mb-2">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                                        <button
                                            onClick={() => handleSelect(item.id)}
                                            disabled={processing}
                                            className="w-full bg-spice-orange hover:bg-spice-gold text-white py-2 rounded-lg font-semibold transition"
                                        >
                                            {processing ? 'Selecting...' : 'Select This'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No items available for tomorrow. Please check back later.</p>
                        )}
                    </div>
                )}

                {/* Upcoming Selections */}
                {upcomingSelections && upcomingSelections.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 border border-spice-orange">
                        <h2 className="text-2xl font-bold text-spice-maroon mb-4">Upcoming Selections</h2>
                        <div className="space-y-4">
                            {upcomingSelections.map((selection) => (
                                <div key={selection.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div>
                                        <p className="font-semibold">{selection.menu_item?.name}</p>
                                        <p className="text-sm text-gray-600">{new Date(selection.selection_date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded ${
                                        selection.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {selection.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

