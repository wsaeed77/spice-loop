import { Head } from '@inertiajs/react';

export default function Home({ message }) {
    return (
        <>
            <Head title="Home" />
            <div className="min-h-screen bg-gradient-to-br from-spice-cream to-white flex items-center justify-center p-8">
                <div className="max-w-4xl w-full text-center">
                    <h1 className="text-5xl font-bold text-spice-maroon mb-4">
                        SpiceLoop
                    </h1>
                    <p className="text-xl text-gray-700 mb-8">
                        {message || 'Welcome to SpiceLoop - Home Cooked Food'}
                    </p>
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <p className="text-gray-600">
                            Your application is running! 🎉
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Next steps: Create controllers, models, and React components for your features.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

