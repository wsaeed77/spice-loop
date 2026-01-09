import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

// Format UK phone number
const formatUKPhone = (phone) => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    let digits = phone.replace(/\D/g, '');
    
    // If starts with 44 (UK country code), remove it
    if (digits.startsWith('44')) {
        digits = digits.substring(2);
    }
    
    // If starts with 0, remove it (UK national format)
    if (digits.startsWith('0')) {
        digits = digits.substring(1);
    }
    
    // Format based on UK phone number patterns (10 digits after removing country code and leading 0)
    if (digits.length === 10) {
        // Mobile numbers: 7XXX XXXXXX
        if (digits.startsWith('7')) {
            return `+44 ${digits.substring(0, 4)} ${digits.substring(4)}`;
        }
        // London numbers: 20 XXXX XXXX
        else if (digits.startsWith('20')) {
            return `+44 ${digits.substring(0, 2)} ${digits.substring(2, 6)} ${digits.substring(6)}`;
        }
        // Area codes starting with 1: 1XXX XXX XXX or 1XX XXX XXXX
        else if (digits.startsWith('1')) {
            // 3-digit area codes (e.g., 113, 114, 115, 116, 117, 118, 121, 131, 141, 151, 161, 171, 181, 191)
            if (digits.substring(0, 3).match(/^(11[3-8]|12[01]|13[01]|14[01]|15[01]|16[01]|17[01]|18[01]|19[01])$/)) {
                return `+44 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
            }
            // 4-digit area codes (e.g., 1200, 1202, 1204, etc.)
            else {
                return `+44 ${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
            }
        }
        // Other area codes: 2XXX XXX XXX (non-London)
        else if (digits.startsWith('2')) {
            return `+44 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
        }
        // Default format for 10 digits
        else {
            return `+44 ${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
        }
    }
    
    // Fallback: return formatted with +44 prefix if we have at least 10 digits
    if (digits.length >= 10) {
        return `+44 ${digits.substring(0, 4)} ${digits.substring(4)}`;
    }
    
    // Final fallback: return as is if format doesn't match
    return phone;
};

export default function Layout({ children, auth }) {
    const { settings } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [footerLogoError, setFooterLogoError] = useState(false);
    const { getCartItemCount } = useCart();
    
    const formattedPhone = settings?.contact_phone ? formatUKPhone(settings.contact_phone) : '';
    const cartItemCount = getCartItemCount();

    return (
        <div className="min-h-screen bg-gradient-to-br from-spice-cream to-white">
            {/* Navigation */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center min-h-[64px] py-2">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity pr-4">
                                {!logoError ? (
                                    <img 
                                        src="/images/spice-loop.png" 
                                        alt="SpiceLoop" 
                                        className="h-16 sm:h-14 md:h-18 w-auto object-contain drop-shadow-sm"
                                        style={{ maxHeight: '96px', maxWidth: '240px', paddingTop: '8px', paddingBottom: '8px' }}
                                        onError={() => setLogoError(true)}
                                    />
                                ) : (
                                    <span className="text-3xl sm:text-2xl font-bold text-spice-maroon">SpiceLoop</span>
                                )}
                            </Link>
                            {/* Desktop Navigation */}
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link href="/" className="border-transparent text-gray-500 hover:border-spice-orange hover:text-spice-maroon inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Home
                                </Link>
                                <Link href="/menu" className="border-transparent text-gray-500 hover:border-spice-orange hover:text-spice-maroon inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Menu
                                </Link>
                                <Link href="/subscription" className="border-transparent text-gray-500 hover:border-spice-orange hover:text-spice-maroon inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Subscription
                                </Link>
                                <Link href="/catering" className="border-transparent text-gray-500 hover:border-spice-orange hover:text-spice-maroon inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Catering
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-spice-maroon hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-spice-orange"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!mobileMenuOpen ? (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                            {/* Desktop Right Side */}
                            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                            {/* Cart Icon */}
                            <Link 
                                href="/menu" 
                                className="relative p-2 text-gray-500 hover:text-spice-maroon transition-colors"
                                title="View Cart"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-spice-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemCount > 9 ? '9+' : cartItemCount}
                                    </span>
                                )}
                            </Link>
                            {formattedPhone && (
                                <a 
                                    href={`tel:${settings.contact_phone.replace(/\D/g, '')}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-spice-orange text-white rounded-full hover:bg-spice-gold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="font-semibold text-sm">{formattedPhone}</span>
                                </a>
                            )}
                            {auth?.user ? (
                                <div className="flex items-center space-x-4">
                                    {auth.user.roles?.some(r => r.name === 'admin') ? (
                                        <>
                                            <Link 
                                                href="/admin/orders-queue" 
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                                Order Queue
                                            </Link>
                                            <Link href="/admin/dashboard" className="text-gray-500 hover:text-spice-maroon">
                                                Admin
                                            </Link>
                                        </>
                                    ) : (
                                        <Link href="/subscriber/dashboard" className="text-gray-500 hover:text-spice-maroon">
                                            Dashboard
                                        </Link>
                                    )}
                                    <button 
                                        onClick={() => router.post('/logout')}
                                        className="text-gray-500 hover:text-spice-maroon"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="text-gray-500 hover:text-spice-maroon">
                                    Login
                                </Link>
                            )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="sm:hidden border-t border-gray-200">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <Link
                                    href="/"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-spice-maroon hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/menu"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-spice-maroon hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Menu
                                </Link>
                                <Link
                                    href="/subscription"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-spice-maroon hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Subscription
                                </Link>
                                <Link
                                    href="/catering"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-spice-maroon hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Catering
                                </Link>
                                
                                {/* Mobile Cart Icon */}
                                <Link
                                    href="/menu"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-spice-maroon hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Cart
                                        {cartItemCount > 0 && (
                                            <span className="ml-2 bg-spice-orange text-white text-xs font-bold rounded-full px-2 py-0.5">
                                                {cartItemCount > 9 ? '9+' : cartItemCount}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                                
                                {/* Mobile Phone Number */}
                                {formattedPhone && (
                                    <a 
                                        href={`tel:${settings.contact_phone.replace(/\D/g, '')}`}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-spice-orange hover:bg-gray-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {formattedPhone}
                                        </div>
                                    </a>
                                )}
                                
                                {/* Mobile Auth Links */}
                                {auth?.user ? (
                                    <>
                                        {auth.user.roles?.some(r => r.name === 'admin') ? (
                                            <>
                                                <Link
                                                    href="/admin/orders-queue"
                                                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 mb-2 text-center font-semibold"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                        </svg>
                                                        Order Queue
                                                    </div>
                                                </Link>
                                                <Link
                                                    href="/admin/dashboard"
                                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-spice-maroon hover:bg-gray-50"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Admin
                                                </Link>
                                            </>
                                        ) : (
                                            <Link
                                                href="/subscriber/dashboard"
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-spice-maroon hover:bg-gray-50"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                router.post('/logout');
                                            }}
                                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-spice-maroon hover:bg-gray-50"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-spice-maroon hover:bg-gray-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-spice-maroon text-white mt-12">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {!footerLogoError ? (
                            <div className="mb-8 mt-6 flex justify-center">
                                <img 
                                    src="/images/spice-loop-light.png" 
                                    alt="SpiceLoop" 
                                    className="h-20 md:h-24 w-auto object-contain bg-white/5 rounded-xl backdrop-blur-sm"
                                    style={{ maxHeight: '96px', maxWidth: '220px', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }}
                                    onError={() => setFooterLogoError(true)}
                                />
                            </div>
                        ) : (
                            <p className="text-lg font-semibold mb-2">SpiceLoop</p>
                        )}
                        <p className="text-sm opacity-90">Home Cooked Food - South Asian Cuisine</p>
                        {formattedPhone && (
                            <div className="mt-4">
                                <a 
                                    href={`tel:${settings.contact_phone.replace(/\D/g, '')}`}
                                    className="inline-flex items-center text-white hover:text-spice-cream transition"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {formattedPhone}
                                </a>
                            </div>
                        )}
                        
                        {/* Social Media Icons */}
                        {(settings?.facebook_url || settings?.instagram_url) && (
                            <div className="mt-6 flex justify-center items-center space-x-4">
                                {settings.facebook_url && (
                                    <a
                                        href={settings.facebook_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-spice-cream transition transform hover:scale-110"
                                        aria-label="Visit our Facebook page"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                )}
                                {settings.instagram_url && (
                                    <a
                                        href={settings.instagram_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-spice-cream transition transform hover:scale-110"
                                        aria-label="Visit our Instagram page"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        )}
                        
                        <p className="text-xs mt-4 opacity-75">© {new Date().getFullYear()} SpiceLoop. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            {settings?.whatsapp_number && (
                <a
                    href={`https://wa.me/${settings.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20BA5A] transition-all z-50 group"
                    aria-label="Chat on WhatsApp"
                >
                    <svg 
                        className="w-8 h-8" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Chat with us on WhatsApp
                    </span>
                </a>
            )}
        </div>
    );
}

