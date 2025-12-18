import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../Components/Layout';

export default function QRCode({ auth, websiteUrl }) {
    const [copied, setCopied] = useState(false);
    
    // Generate modern styled QR code with custom colors matching SpiceLoop funky brand
    // Using QR Server API with modern styling: vibrant tangerine orange (#F77F00), white background, larger size, better margins
    // Size: 600x600 for high quality, color: tangerine orange (#F77F00), margin: 2, quiet zone: 3 for better scanning
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(websiteUrl)}&color=F77F00&bgcolor=FFFFFF&margin=2&qzone=3&format=png&ecc=M`;
    
    // Alternative modern QR code with gradient effect (using different API if needed)
    // For now using the above with CSS enhancements for modern look
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(websiteUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const downloadQRCode = () => {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = 'spiceloop-qr-code.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Layout auth={auth}>
            <Head title="QR Code - SpiceLoop Admin" />
            
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
                    <h1 className="text-4xl font-bold text-spice-maroon">Website QR Code</h1>
                    <p className="text-gray-600 mt-2">Generate and download QR code for www.spiceloop.com</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 border border-spice-orange">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* QR Code Display */}
                        <div className="flex-shrink-0">
                            <div className="relative bg-gradient-to-br from-white to-spice-cream p-6 rounded-2xl border-2 border-spice-orange shadow-xl transform hover:scale-105 transition-transform duration-300">
                                {/* Decorative corner elements */}
                                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-spice-maroon rounded-tl-lg"></div>
                                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-spice-orange rounded-tr-lg"></div>
                                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-spice-orange rounded-bl-lg"></div>
                                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-spice-maroon rounded-br-lg"></div>
                                
                                <div className="bg-white p-4 rounded-xl shadow-inner relative overflow-hidden">
                                    {/* Modern QR code with rounded corners effect */}
                                    <div className="relative">
                                        <img 
                                            src={qrCodeUrl} 
                                            alt="QR Code for SpiceLoop Website" 
                                            className="w-72 h-72 rounded-2xl"
                                            style={{
                                                filter: 'drop-shadow(0 8px 16px rgba(139, 0, 0, 0.15))',
                                                imageRendering: 'crisp-edges',
                                            }}
                                        />
                                        {/* Overlay gradient for modern look */}
                                        <div className="absolute inset-0 rounded-2xl pointer-events-none" 
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                
                                {/* Brand label */}
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-semibold text-spice-maroon">www.spiceloop.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Information and Actions */}
                        <div className="flex-1 w-full md:w-auto">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-spice-maroon mb-4">Website URL</h2>
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={websiteUrl}
                                        readOnly
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-4 py-2 bg-spice-orange text-white rounded-lg hover:bg-spice-gold transition flex items-center gap-2"
                                    >
                                        {copied ? (
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
                                                Copy URL
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={downloadQRCode}
                                    className="w-full md:w-auto px-6 py-3 bg-spice-maroon text-white rounded-lg hover:bg-spice-red transition flex items-center justify-center gap-2 font-semibold"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download QR Code
                                </button>

                                <div className="bg-spice-cream p-4 rounded-lg border border-spice-orange">
                                    <h3 className="font-semibold text-spice-maroon mb-2">How to use:</h3>
                                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                                        <li>Scan the QR code with any smartphone camera</li>
                                        <li>Download the QR code image to print or share</li>
                                        <li>Use it on marketing materials, menus, or business cards</li>
                                        <li>The QR code links directly to www.spiceloop.com</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

