import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Layout({ children, auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [footerLogoError, setFooterLogoError] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-spice-cream to-white">
            {/* Navigation */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center min-h-[64px] py-2">
                        <div className="flex">
                            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity pr-4">
                                {!logoError ? (
                                    <img 
                                        src="/images/spice-loop.png" 
                                        alt="SpiceLoop" 
                                        className="h-14 md:h-18 w-auto object-contain drop-shadow-sm"
                                        style={{ maxHeight: '72px', maxWidth: '180px', paddingTop: '8px', paddingBottom: '8px' }}
                                        onError={() => setLogoError(true)}
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-spice-maroon">SpiceLoop</span>
                                )}
                            </Link>
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
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            {auth?.user ? (
                                <div className="flex items-center space-x-4">
                                    {auth.user.roles?.some(r => r.name === 'admin') ? (
                                        <Link href="/admin/dashboard" className="text-gray-500 hover:text-spice-maroon">
                                            Admin
                                        </Link>
                                    ) : (
                                        <Link href="/subscriber/dashboard" className="text-gray-500 hover:text-spice-maroon">
                                            Dashboard
                                        </Link>
                                    )}
                                    <form method="POST" action="/logout">
                                        <button type="submit" className="text-gray-500 hover:text-spice-maroon">
                                            Logout
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <Link href="/login" className="text-gray-500 hover:text-spice-maroon">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
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
                                    src="/images/spice-loop.png" 
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
                        <p className="text-xs mt-4 opacity-75">© {new Date().getFullYear()} SpiceLoop. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

