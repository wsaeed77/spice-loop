<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'SpiceLoop') }}</title>
        
        <!-- Default SEO Meta Tags -->
        <meta name="description" content="SpiceLoop - Authentic South Asian Cuisine in Milton Keynes, UK. Home-cooked meals, weekly subscriptions, and catering services. Order delicious Indian, Pakistani, and Bangladeshi food delivered to your door.">
        <meta name="keywords" content="South Asian food, Indian food, Pakistani food, Bangladeshi food, Milton Keynes, UK, home cooked meals, food delivery, weekly meal subscription, catering services, authentic curry, biryani, Milton Keynes restaurants, Indian takeaway Milton Keynes">
        <meta name="author" content="SpiceLoop">
        <meta name="robots" content="index, follow">
        <meta name="language" content="English">
        <meta name="geo.region" content="GB-MK">
        <meta name="geo.placename" content="Milton Keynes">
        <meta name="geo.position" content="52.0406;-0.7594">
        <link rel="canonical" href="{{ url()->current() }}">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="SpiceLoop - Authentic South Asian Cuisine in Milton Keynes, UK">
        <meta property="og:description" content="Home-cooked authentic South Asian meals delivered in Milton Keynes. Weekly subscriptions, menu orders, and catering services available.">
        <meta property="og:image" content="{{ url('/images/hero-banner.jpg') }}">
        <meta property="og:locale" content="en_GB">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ url()->current() }}">
        <meta name="twitter:title" content="SpiceLoop - Authentic South Asian Cuisine in Milton Keynes, UK">
        <meta name="twitter:description" content="Home-cooked authentic South Asian meals delivered in Milton Keynes. Weekly subscriptions, menu orders, and catering services available.">
        <meta name="twitter:image" content="{{ url('/images/hero-banner.jpg') }}">
        
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        
        @if(request()->routeIs('home'))
        <!-- T2MS Widget Script -->
        <script
            src="https://www.t2ms.biz/widget"
            data-client-id="cmj0lbj7r000bsm0fomqj96pw"
            data-api="https://www.t2ms.biz"
            defer
        ></script>
        @endif
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

