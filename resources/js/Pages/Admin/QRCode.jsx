import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../Components/Layout';

export default function QRCode({ auth, websiteUrl, contactSubscriptionUrl }) {
    const [copiedWebsite, setCopiedWebsite] = useState(false);
    const [copiedSubscription, setCopiedSubscription] = useState(false);
    
    // Generate modern styled QR code with custom colors matching SpiceLoop funky brand
    // Using QR Server API with modern styling: vibrant tangerine orange (#F77F00), white background, larger size, better margins
    // Size: 600x600 for high quality, color: tangerine orange (#F77F00), margin: 2, quiet zone: 3 for better scanning
    const websiteQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(websiteUrl)}&color=F77F00&bgcolor=FFFFFF&margin=2&qzone=3&format=png&ecc=M`;
    const subscriptionQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(contactSubscriptionUrl)}&color=F77F00&bgcolor=FFFFFF&margin=2&qzone=3&format=png&ecc=M`;
    
    const copyWebsiteToClipboard = () => {
        navigator.clipboard.writeText(websiteUrl).then(() => {
            setCopiedWebsite(true);
            setTimeout(() => setCopiedWebsite(false), 2000);
        });
    };

    const copySubscriptionToClipboard = () => {
        navigator.clipboard.writeText(contactSubscriptionUrl).then(() => {
            setCopiedSubscription(true);
            setTimeout(() => setCopiedSubscription(false), 2000);
        });
    };

    const downloadQRCode = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Layout auth={auth}>
            <Head title="QR Code - SpiceLoop Admin" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <h1 className="text-4xl font-bold text-spice-maroon">QR Codes</h1>
                    <p className="text-gray-600 mt-2">Generate and download QR codes for your website and contact subscription page</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Website QR Code */}
                    <div className="bg-white rounded-lg shadow-lg p-8 border border-spice-orange">
                        <h2 className="text-2xl font-bold text-spice-maroon mb-6">Website QR Code</h2>
                        <div className="flex flex-col items-center gap-6">
                            {/* QR Code Display */}
                            <div className="relative bg-gradient-to-br from-white to-spice-cream p-6 rounded-2xl border-2 border-spice-orange shadow-xl transform hover:scale-105 transition-transform duration-300">
                                {/* Decorative corner elements */}
                                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-spice-maroon rounded-tl-lg"></div>
                                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-spice-orange rounded-tr-lg"></div>
                                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-spice-orange rounded-bl-lg"></div>
                                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-spice-maroon rounded-br-lg"></div>
                                
                                <div className="bg-white p-4 rounded-xl shadow-inner relative overflow-hidden">
                                    <div className="relative">
                                        <img 
                                            src={websiteQrCodeUrl} 
                                            alt="QR Code for SpiceLoop Website" 
                                            className="w-64 h-64 rounded-2xl"
                                            style={{
                                                filter: 'drop-shadow(0 8px 16px rgba(139, 0, 0, 0.15))',
                                                imageRendering: 'crisp-edges',
                                            }}
                                        />
                                        <div className="absolute inset-0 rounded-2xl pointer-events-none" 
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-semibold text-spice-maroon">www.spiceloop.com</p>
                                </div>
                            </div>

                            {/* URL and Actions */}
                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={websiteUrl}
                                        readOnly
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                                    />
                                    <button
                                        onClick={copyWebsiteToClipboard}
                                        className="px-4 py-2 bg-spice-orange text-white rounded-lg hover:bg-spice-gold transition flex items-center gap-2"
                                    >
                                        {copiedWebsite ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <button
                                    onClick={() => downloadQRCode(websiteQrCodeUrl, 'spiceloop-website-qr-code.png')}
                                    className="w-full px-6 py-3 bg-spice-maroon text-white rounded-lg hover:bg-spice-red transition flex items-center justify-center gap-2 font-semibold"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download QR Code
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contact Subscription QR Code */}
                    <div className="bg-white rounded-lg shadow-lg p-8 border border-spice-orange">
                        <h2 className="text-2xl font-bold text-spice-maroon mb-6">Contact Subscription QR Code</h2>
                        <div className="flex flex-col items-center gap-6">
                            {/* QR Code Display */}
                            <div className="relative bg-gradient-to-br from-white to-spice-cream p-6 rounded-2xl border-2 border-spice-orange shadow-xl transform hover:scale-105 transition-transform duration-300">
                                {/* Decorative corner elements */}
                                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-spice-maroon rounded-tl-lg"></div>
                                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-spice-orange rounded-tr-lg"></div>
                                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-spice-orange rounded-bl-lg"></div>
                                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-spice-maroon rounded-br-lg"></div>
                                
                                <div className="bg-white p-4 rounded-xl shadow-inner relative overflow-hidden">
                                    <div className="relative">
                                        <img 
                                            src={subscriptionQrCodeUrl} 
                                            alt="QR Code for Contact Subscription" 
                                            className="w-64 h-64 rounded-2xl"
                                            style={{
                                                filter: 'drop-shadow(0 8px 16px rgba(139, 0, 0, 0.15))',
                                                imageRendering: 'crisp-edges',
                                            }}
                                        />
                                        <div className="absolute inset-0 rounded-2xl pointer-events-none" 
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-semibold text-spice-maroon">Contact Subscription</p>
                                </div>
                            </div>

                            {/* URL and Actions */}
                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={contactSubscriptionUrl}
                                        readOnly
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                                    />
                                    <button
                                        onClick={copySubscriptionToClipboard}
                                        className="px-4 py-2 bg-spice-orange text-white rounded-lg hover:bg-spice-gold transition flex items-center gap-2"
                                    >
                                        {copiedSubscription ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <button
                                    onClick={() => downloadQRCode(subscriptionQrCodeUrl, 'spiceloop-contact-subscription-qr-code.png')}
                                    className="w-full px-6 py-3 bg-spice-maroon text-white rounded-lg hover:bg-spice-red transition flex items-center justify-center gap-2 font-semibold"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download QR Code
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage Instructions */}
                <div className="mt-8 bg-spice-cream p-6 rounded-lg border border-spice-orange">
                    <h3 className="font-semibold text-spice-maroon mb-3 text-lg">How to use:</h3>
                    <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                        <li>Scan the QR codes with any smartphone camera to access the pages</li>
                        <li>Download the QR code images to print or share on marketing materials</li>
                        <li>Use the website QR code on menus, business cards, or promotional materials</li>
                        <li>Use the contact subscription QR code to collect customer contact information and permissions</li>
                        <li>Both QR codes link directly to their respective pages on spiceloop.com</li>
                    </ul>
                </div>
            </div>
        </Layout>
    );
}

