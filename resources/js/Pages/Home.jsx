import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../Components/Layout';

export default function Home({ auth, weeklyCharge, weeklyMenu }) {
    const [heroImageError, setHeroImageError] = useState(false);
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayLabels = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
    };

    return (
        <Layout auth={auth}>
            <Head title="Home - SpiceLoop" />
            
            {/* Hero Section */}
            <div 
                className="relative bg-gradient-to-r from-spice-maroon to-spice-red text-white py-20 bg-cover bg-center bg-no-repeat min-h-[500px] flex items-center"
                style={!heroImageError ? {
                    backgroundImage: 'url(/images/hero-banner.jpg)',
                } : {}}
            >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-spice-maroon/85 to-spice-red/85"></div>
                
                {/* Hidden image to detect if it exists */}
                {!heroImageError && (
                    <img 
                        src="/images/hero-banner.jpg" 
                        alt="" 
                        className="hidden"
                        onError={() => setHeroImageError(true)}
                    />
                )}
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Welcome to SpiceLoop</h1>
                    <p className="text-xl md:text-2xl mb-8 drop-shadow-md">HOME COOKED FOOD - South Asian Cuisine</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link href="/menu" className="bg-spice-orange hover:bg-spice-gold text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl transform hover:scale-105">
                            Order Now
                        </Link>
                        <Link href="/subscription" className="bg-white text-spice-maroon hover:bg-spice-cream px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl transform hover:scale-105">
                            Subscribe
                        </Link>
                    </div>
                </div>
            </div>

            {/* Weekly Deals Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-spice-orange text-white p-6 rounded-t-lg">
                    <h2 className="text-3xl font-bold text-center">WEEKLY DEALS</h2>
                </div>
                <div className="bg-spice-maroon p-6 rounded-b-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg p-4 border-2 border-spice-orange">
                                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                                <p className="text-center text-gray-600">Food Item {i}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Weekly Menu Preview */}
            {weeklyMenu && Object.keys(weeklyMenu).length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-3xl font-bold text-spice-maroon mb-6 text-center">Weekly Subscription Menu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {days.map((day) => (
                            <div key={day} className="bg-white rounded-lg shadow-md p-4 border border-spice-orange">
                                <h3 className="font-bold text-spice-maroon mb-3">{dayLabels[day]}</h3>
                                {weeklyMenu[day]?.map((option) => (
                                    <div key={option.id} className="text-sm text-gray-600 mb-2">
                                        • {option.menu_item?.name}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-xl font-semibold text-spice-maroon mb-2">
                            Weekly Subscription: ${weeklyCharge?.toFixed(2) || '50.00'}
                        </p>
                        <Link href="/subscription" className="bg-spice-orange hover:bg-spice-gold text-white px-8 py-3 rounded-lg font-semibold transition inline-block">
                            Subscribe Now
                        </Link>
                    </div>
                </div>
            )}

            {/* Party & Catering Section */}
            <div 
                className="relative bg-spice-maroon text-white py-16 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(/images/catering-banner.jpg)',
                }}
            >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-spice-maroon/80"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">PARTY & CATERING ORDERS AVAILABLE</h2>
                    <p className="text-lg md:text-xl mb-6 drop-shadow-md">For all your special events. Book now!</p>
                    <Link href="/catering" className="bg-spice-orange hover:bg-spice-gold text-white px-8 py-3 rounded-lg font-semibold transition inline-block shadow-lg hover:shadow-xl transform hover:scale-105">
                        Request Catering
                    </Link>
                </div>
            </div>

            {/* Services Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-spice-maroon mb-8 text-center">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-spice-orange">
                        <h3 className="text-xl font-bold text-spice-maroon mb-3">Weekly Subscription</h3>
                        <p className="text-gray-600 mb-4">Subscribe to our weekly meal plan. Select your meals daily from Monday to Friday.</p>
                        <Link href="/subscription" className="text-spice-orange hover:text-spice-maroon font-semibold">
                            Learn More →
                        </Link>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-spice-orange">
                        <h3 className="text-xl font-bold text-spice-maroon mb-3">Menu Orders</h3>
                        <p className="text-gray-600 mb-4">Order from our full menu. Available in select cities. Fresh, home-cooked meals delivered to you.</p>
                        <Link href="/menu" className="text-spice-orange hover:text-spice-maroon font-semibold">
                            View Menu →
                        </Link>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-spice-orange">
                        <h3 className="text-xl font-bold text-spice-maroon mb-3">Catering & Events</h3>
                        <p className="text-gray-600 mb-4">Planning a party or special event? We provide catering services for all occasions.</p>
                        <Link href="/catering" className="text-spice-orange hover:text-spice-maroon font-semibold">
                            Request Quote →
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
