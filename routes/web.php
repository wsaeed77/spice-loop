<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CateringController as AdminCateringController;
use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\CostCalculatorController;
use App\Http\Controllers\Admin\MenuItemCalculatorController;
use App\Http\Controllers\Admin\MenuController as AdminMenuController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SpecialOrderController as AdminSpecialOrderController;
use App\Http\Controllers\Admin\SubscriptionRequestController;
use App\Http\Controllers\Admin\WeeklyMenuController;
use App\Http\Controllers\SpecialOrderController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CateringController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

// Temporary route to seed menu items - REMOVE AFTER USE
Route::get('/seed-menu', function () {
    $menuItems = [
        // Curries
        ['name' => 'Butter Chicken', 'description' => 'Creamy tomato-based curry with tender chicken pieces, cooked in butter and aromatic spices.', 'price' => 16.99, 'category' => 'Curries', 'is_available' => true, 'is_subscription_item' => true],
        ['name' => 'Chicken Tikka Masala', 'description' => 'Grilled chicken chunks in a rich, creamy tomato and yogurt sauce with aromatic spices.', 'price' => 17.99, 'category' => 'Curries', 'is_available' => true, 'is_subscription_item' => true],
        ['name' => 'Lamb Vindaloo', 'description' => 'Spicy and tangy curry with tender lamb, potatoes, and a blend of hot spices.', 'price' => 19.99, 'category' => 'Curries', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Palak Paneer', 'description' => 'Fresh spinach curry with cubes of soft paneer cheese, seasoned with garlic and spices.', 'price' => 14.99, 'category' => 'Vegetarian', 'is_available' => true, 'is_subscription_item' => true],
        ['name' => 'Chana Masala', 'description' => 'Chickpeas cooked in a flavorful tomato and onion gravy with traditional spices.', 'price' => 13.99, 'category' => 'Vegetarian', 'is_available' => true, 'is_subscription_item' => true],
        ['name' => 'Dal Makhani', 'description' => 'Creamy black lentils and kidney beans slow-cooked with butter and spices.', 'price' => 12.99, 'category' => 'Vegetarian', 'is_available' => true, 'is_subscription_item' => true],
        ['name' => 'Rogan Josh', 'description' => 'Aromatic lamb curry with yogurt, spices, and a rich, deep red color.', 'price' => 20.99, 'category' => 'Curries', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Saag Paneer', 'description' => 'Creamy spinach curry with cubes of paneer cheese.', 'price' => 15.99, 'category' => 'Vegetarian', 'is_available' => true, 'is_subscription_item' => true],
        ['name' => 'Aloo Gobi', 'description' => 'Potatoes and cauliflower cooked with onions, tomatoes, and spices.', 'price' => 13.99, 'category' => 'Vegetarian', 'is_available' => true, 'is_subscription_item' => true],
        
        // Biryanis
        ['name' => 'Chicken Biryani', 'description' => 'Fragrant basmati rice layered with spiced chicken, caramelized onions, and saffron.', 'price' => 18.99, 'category' => 'Biryani', 'is_available' => true, 'is_subscription_item' => true],
        ['name' => 'Lamb Biryani', 'description' => 'Aromatic basmati rice with tender lamb pieces, spices, and herbs.', 'price' => 21.99, 'category' => 'Biryani', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Vegetable Biryani', 'description' => 'Fragrant rice cooked with mixed vegetables, spices, and saffron.', 'price' => 15.99, 'category' => 'Biryani', 'is_available' => true, 'is_subscription_item' => true],
        
        // Breads
        ['name' => 'Garlic Naan', 'description' => 'Fresh baked flatbread brushed with garlic butter and herbs.', 'price' => 4.99, 'category' => 'Breads', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Butter Naan', 'description' => 'Soft, fluffy bread brushed with butter, perfect for dipping.', 'price' => 3.99, 'category' => 'Breads', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Roti', 'description' => 'Whole wheat flatbread, traditional and healthy.', 'price' => 2.99, 'category' => 'Breads', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Paratha', 'description' => 'Flaky, layered flatbread, pan-fried to perfection.', 'price' => 4.49, 'category' => 'Breads', 'is_available' => true, 'is_subscription_item' => false],
        
        // Appetizers
        ['name' => 'Samosas (2 pieces)', 'description' => 'Crispy pastry filled with spiced potatoes and peas, served with chutney.', 'price' => 5.99, 'category' => 'Appetizers', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Chicken Pakora', 'description' => 'Chicken pieces marinated in spices, coated in chickpea flour and deep-fried.', 'price' => 7.99, 'category' => 'Appetizers', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Paneer Tikka', 'description' => 'Grilled paneer cubes marinated in yogurt and spices, served with mint chutney.', 'price' => 8.99, 'category' => 'Appetizers', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Onion Bhaji', 'description' => 'Crispy fritters made with sliced onions and chickpea flour.', 'price' => 5.49, 'category' => 'Appetizers', 'is_available' => true, 'is_subscription_item' => false],
        
        // Sides
        ['name' => 'Basmati Rice', 'description' => 'Fragrant long-grain basmati rice, perfectly steamed.', 'price' => 3.99, 'category' => 'Sides', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Jeera Rice', 'description' => 'Basmati rice cooked with cumin seeds and aromatic spices.', 'price' => 4.99, 'category' => 'Sides', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Raita', 'description' => 'Cool yogurt with cucumber, mint, and spices.', 'price' => 3.49, 'category' => 'Sides', 'is_available' => true, 'is_subscription_item' => false],
        
        // Desserts
        ['name' => 'Gulab Jamun', 'description' => 'Soft, sweet milk dumplings soaked in rose-flavored syrup.', 'price' => 5.99, 'category' => 'Desserts', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Kheer', 'description' => 'Creamy rice pudding with cardamom, nuts, and saffron.', 'price' => 5.49, 'category' => 'Desserts', 'is_available' => true, 'is_subscription_item' => false],
        
        // Beverages
        ['name' => 'Mango Lassi', 'description' => 'Refreshing yogurt drink with fresh mango and a hint of cardamom.', 'price' => 4.99, 'category' => 'Beverages', 'is_available' => true, 'is_subscription_item' => false],
        ['name' => 'Sweet Lassi', 'description' => 'Traditional yogurt drink, sweetened and flavored with rose water.', 'price' => 3.99, 'category' => 'Beverages', 'is_available' => true, 'is_subscription_item' => false],
    ];
    
    $count = 0;
    foreach ($menuItems as $item) {
        \App\Models\MenuItem::create($item);
        $count++;
    }
    
    return response()->json(['success' => true, 'message' => "Created {$count} menu items successfully!"]);
});

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/menu', [MenuController::class, 'index'])->name('menu');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
Route::post('/special-orders', [SpecialOrderController::class, 'store'])->name('special-orders.store');
Route::get('/subscription', [SubscriptionController::class, 'index'])->name('subscription');
Route::post('/subscription', [SubscriptionController::class, 'store'])->name('subscription.store');
Route::get('/catering', [CateringController::class, 'index'])->name('catering');
Route::post('/catering', [CateringController::class, 'store'])->name('catering.store');
Route::get('/contact-subscription', [ContactController::class, 'index'])->name('contact-subscription');
Route::post('/contact-subscription', [ContactController::class, 'store'])->name('contact-subscription.store');

// Authentication Routes
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Subscriber Routes (Authenticated)
Route::middleware(['auth'])->group(function () {
    Route::get('/subscriber/dashboard', [SubscriberController::class, 'dashboard'])->name('subscriber.dashboard');
    Route::post('/subscriber/select-item', [SubscriberController::class, 'selectItem'])->name('subscriber.select-item');
});

// Admin Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/qr-code', [AdminController::class, 'qrCode'])->name('qr-code');
    
    // Menu Management
    Route::resource('menu', AdminMenuController::class);
    
    // Orders Management
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');
    
    // Catering Management
    Route::get('/catering', [AdminCateringController::class, 'index'])->name('catering.index');
    Route::get('/catering/{id}', [AdminCateringController::class, 'show'])->name('catering.show');
    Route::patch('/catering/{id}/status', [AdminCateringController::class, 'updateStatus'])->name('catering.update-status');
    
    // Cities Management
    Route::get('/cities', [CityController::class, 'index'])->name('cities.index');
    Route::post('/cities', [CityController::class, 'store'])->name('cities.store');
    Route::patch('/cities/{city}', [CityController::class, 'update'])->name('cities.update');
    Route::delete('/cities/{city}', [CityController::class, 'destroy'])->name('cities.destroy');
    
    // Weekly Menu Management
    Route::get('/weekly-menu', [WeeklyMenuController::class, 'index'])->name('weekly-menu.index');
    Route::post('/weekly-menu', [WeeklyMenuController::class, 'store'])->name('weekly-menu.store');
    Route::delete('/weekly-menu/{id}', [WeeklyMenuController::class, 'destroy'])->name('weekly-menu.destroy');
    
    // Settings Management
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');
    
    // Cost Calculator
    Route::get('/cost-calculator', [CostCalculatorController::class, 'index'])->name('cost-calculator.index');
    
    // Menu Item Calculator
    Route::get('/menu/{menuItem}/calculator', [MenuItemCalculatorController::class, 'show'])->name('menu-item-calculator.show');
    Route::post('/menu/{menuItem}/calculator', [MenuItemCalculatorController::class, 'store'])->name('menu-item-calculator.store');
    Route::delete('/menu/{menuItem}/calculator', [MenuItemCalculatorController::class, 'destroy'])->name('menu-item-calculator.destroy');
    
    // Special Orders Management
    Route::get('/special-orders', [AdminSpecialOrderController::class, 'index'])->name('special-orders.index');
    Route::get('/special-orders/{id}', [AdminSpecialOrderController::class, 'show'])->name('special-orders.show');
    Route::patch('/special-orders/{id}/status', [AdminSpecialOrderController::class, 'updateStatus'])->name('special-orders.update-status');
    
    // Subscription Requests Management
    Route::get('/subscription-requests', [SubscriptionRequestController::class, 'index'])->name('subscription-requests.index');
    Route::get('/subscription-requests/{id}', [SubscriptionRequestController::class, 'show'])->name('subscription-requests.show');
    Route::patch('/subscription-requests/{id}/status', [SubscriptionRequestController::class, 'updateStatus'])->name('subscription-requests.update-status');
    
    // Contacts Management
    Route::resource('contacts', ContactController::class);
});
