import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

// Format UK phone number
const formatUKPhone = (phone) => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    let digits = phone.replace(/\D/g, '');
    
    // If starts with 44 (UK country code), remove it
    if (digits.startsWith('44')) {
        digits = digits.substring(2);
    }
    
    // If starts with 0, remove it
    if (digits.startsWith('0')) {
        digits = digits.substring(1);
    }
    
    // Format based on length
    if (digits.length === 10) {
        // Mobile or landline: 07857 110325 or 020 1234 5678
        if (digits.startsWith('07')) {
            // Mobile: 07857 110325
            return `+44 ${digits.substring(0, 4)} ${digits.substring(4)}`;
        } else if (digits.startsWith('02')) {
            // London/Area code starting with 02: 020 1234 5678
            return `+44 ${digits.substring(0, 3)} ${digits.substring(3, 7)} ${digits.substring(7)}`;
        } else {
            // Other landline: 0123 456 7890
            return `+44 ${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
        }
    } else if (digits.length === 11 && digits.startsWith('0')) {
        // 11 digits starting with 0: 01234 567890
        return `+44 ${digits.substring(1, 5)} ${digits.substring(5)}`;
    }
    
    // Fallback: return as is if format doesn't match
    return phone;
};

export default function Layout({ children, auth }) {
    const { settings } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [footerLogoError, setFooterLogoError] = useState(false);
    
    const formattedPhone = settings?.contact_phone ? formatUKPhone(settings.contact_phone) : '';

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
                        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
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
                                        <Link href="/admin/dashboard" className="text-gray-500 hover:text-spice-maroon">
                                            Admin
                                        </Link>
                                    ) : (
                                        <Link href="/subscriber/dashboard" className="text-gray-500 hover:text-spice-maroon">
                                            Dashboard
                                        </Link>
                                    )}
                                    <button 
                                        onClick={() => router.post(route('logout'))}
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
                    className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20BA5A] transition-all z-50 group"
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

