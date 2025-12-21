import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../Components/Layout';

export default function Home({ auth, weeklyCharge, weeklyMenu, featuredItems, weekendSpecial }) {
    const [heroImageError, setHeroImageError] = useState(false);
    const [videoError, setVideoError] = useState(false);
    
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
            <Head>
                <title>SpiceLoop - Authentic South Asian Cuisine in Milton Keynes, UK</title>
                <meta name="description" content="SpiceLoop offers authentic home-cooked South Asian cuisine in Milton Keynes, UK. Order delicious Indian, Pakistani, and Bangladeshi meals. Weekly meal subscriptions and catering services available." />
                <meta name="keywords" content="South Asian food Milton Keynes, Indian food delivery Milton Keynes, Pakistani food Milton Keynes, Bangladeshi food Milton Keynes, home cooked meals Milton Keynes, weekly meal subscription Milton Keynes, catering services Milton Keynes, authentic curry Milton Keynes, biryani Milton Keynes, Indian takeaway Milton Keynes UK" />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : 'https://spiceloop.com'} />
                
                {/* Open Graph */}
                <meta property="og:title" content="SpiceLoop - Authentic South Asian Cuisine in Milton Keynes, UK" />
                <meta property="og:description" content="Home-cooked authentic South Asian meals delivered in Milton Keynes. Weekly subscriptions, menu orders, and catering services available." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.origin : 'https://spiceloop.com'} />
                <meta property="og:image" content={typeof window !== 'undefined' ? `${window.location.origin}/images/hero-banner.jpg` : '/images/hero-banner.jpg'} />
                <meta property="og:locale" content="en_GB" />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="SpiceLoop - Authentic South Asian Cuisine in Milton Keynes, UK" />
                <meta name="twitter:description" content="Home-cooked authentic South Asian meals delivered in Milton Keynes. Weekly subscriptions, menu orders, and catering services available." />
                <meta name="twitter:image" content={typeof window !== 'undefined' ? `${window.location.origin}/images/hero-banner.jpg` : '/images/hero-banner.jpg'} />
                
                {/* Structured Data - Local Business */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FoodEstablishment",
                        "name": "SpiceLoop",
                        "description": "Authentic South Asian Cuisine - Home-cooked meals delivered in Milton Keynes, UK",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Milton Keynes",
                            "addressRegion": "Buckinghamshire",
                            "addressCountry": "GB"
                        },
                        "areaServed": {
                            "@type": "City",
                            "name": "Milton Keynes"
                        },
                        "servesCuisine": ["Indian", "Pakistani", "Bangladeshi", "South Asian"],
                        "priceRange": "££",
                        "url": typeof window !== 'undefined' ? window.location.origin : 'https://spiceloop.com',
                        "sameAs": []
                    })
                }} />
            </Head>
            
            {/* Hero Section */}
            <div 
                className="relative bg-gradient-to-r from-spice-maroon to-spice-red text-white py-20 bg-cover bg-center bg-no-repeat min-h-[500px] flex items-center overflow-hidden"
                style={videoError && !heroImageError ? {
                    backgroundImage: 'url(/images/hero-banner.jpg)',
                } : {}}
            >
                {/* Background Video */}
                {!videoError && (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => setVideoError(true)}
                    >
                        <source src="/videos/banner-video.mp4" type="video/mp4" />
                    </video>
                )}
                
                {/* Fallback Background Image */}
                {videoError && !heroImageError && (
                    <img 
                        src="/images/hero-banner.jpg" 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => setHeroImageError(true)}
                    />
                )}
                
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-spice-maroon/85 to-spice-red/85"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Welcome to SpiceLoop</h1>
                    <p className="text-xl md:text-2xl mb-8 drop-shadow-md">HOME COOKED FOOD - Authentic South Asian Cuisine</p>
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

            {/* Weekend Special Section */}
            {weekendSpecial && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-spice-orange transform hover:shadow-3xl transition-shadow duration-300">
                        {/* Header Badge */}
                        <div className="bg-gradient-to-r from-spice-orange to-spice-gold text-white py-3 px-6 text-center">
                            <span className="text-lg font-bold uppercase tracking-wider">🌟 Weekend Special 🌟</span>
                        </div>
                        
                        <div className="p-8 md:p-12">
                            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                                {/* Image Section */}
                                <div className="flex-shrink-0 w-full lg:w-2/5">
                                    {weekendSpecial.image ? (
                                        <div className="relative rounded-2xl overflow-hidden shadow-xl">
                                            <img
                                                src={weekendSpecial.image}
                                                alt={weekendSpecial.name}
                                                className="w-full h-64 md:h-96 object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder-food.jpg';
                                                }}
                                            />
                                            <div className="absolute top-4 left-4 bg-spice-maroon text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                                                SPECIAL OFFER
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-64 md:h-96 bg-gradient-to-br from-spice-orange/20 to-spice-gold/20 rounded-2xl flex items-center justify-center border-4 border-spice-orange/30">
                                            <span className="text-spice-maroon text-lg font-semibold">No Image</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Content Section */}
                                <div className="flex-1 text-center lg:text-left">
                                    <h2 className="text-4xl md:text-5xl font-bold text-spice-maroon mb-4">
                                        {weekendSpecial.name}
                                    </h2>
                                    {weekendSpecial.description && (
                                        <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                                            {weekendSpecial.description}
                                        </p>
                                    )}
                                    <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-4">
                                        <div className="bg-gradient-to-r from-spice-orange to-spice-gold text-white px-8 py-4 rounded-xl font-bold text-3xl shadow-lg">
                                            £{parseFloat(weekendSpecial.price).toFixed(2)}
                                        </div>
                                        <Link 
                                            href="/menu" 
                                            className="bg-spice-maroon hover:bg-spice-red text-white px-10 py-4 rounded-xl font-semibold text-lg transition shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            Order Now →
                                        </Link>
                                    </div>
                                    {weekendSpecial.category && (
                                        <p className="text-gray-600 text-sm font-medium">
                                            Category: <span className="text-spice-maroon font-semibold">{weekendSpecial.category}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chef's Specials / Featured Menu Items Section */}
            {featuredItems && featuredItems.length > 0 && (
                <div className="w-full">
                    <div className="bg-spice-orange text-white py-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-center">CHEF'S SPECIALS</h2>
                            <p className="text-center mt-2 text-spice-cream">Our Most Beloved Dishes</p>
                        </div>
                    </div>
                    <div className="bg-spice-maroon py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {featuredItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href="/menu"
                                        className="bg-white rounded-lg overflow-hidden border-2 border-spice-orange hover:border-spice-gold transition shadow-lg hover:shadow-xl"
                                    >
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholder-food.jpg';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="text-xl font-bold text-spice-maroon mb-2">{item.name}</h3>
                                            {item.description && (
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-2xl font-bold text-spice-orange">£{parseFloat(item.price).toFixed(2)}</span>
                                                <span className="text-sm text-gray-500">{item.category || 'Menu Item'}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Weekly Menu Preview */}
            {weeklyMenu && Object.keys(weeklyMenu).length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-3xl font-bold text-spice-maroon mb-2 text-center">Weekly Subscription Menu</h2>
                    <p className="text-lg text-gray-600 mb-6 text-center">Single serving meal including 2 roti or bowl of rice</p>
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
                            Weekly Subscription: £{typeof weeklyCharge === 'number' ? weeklyCharge.toFixed(2) : parseFloat(weeklyCharge || '50.00').toFixed(2)}
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
