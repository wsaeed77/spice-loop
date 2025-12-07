<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CateringController as AdminCateringController;
use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\MenuController as AdminMenuController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\WeeklyMenuController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CateringController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/menu', [MenuController::class, 'index'])->name('menu');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
Route::get('/subscription', [SubscriptionController::class, 'index'])->name('subscription');
Route::post('/subscription', [SubscriptionController::class, 'store'])->name('subscription.store');
Route::get('/catering', [CateringController::class, 'index'])->name('catering');
Route::post('/catering', [CateringController::class, 'store'])->name('catering.store');

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
    
    // Menu Management
    Route::resource('menu', AdminMenuController::class);
    
    // Orders Management
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');
    
    // Catering Management
    Route::get('/catering', [AdminCateringController::class, 'index'])->name('catering.index');
    Route::get('/catering/{cateringRequest}', [AdminCateringController::class, 'show'])->name('catering.show');
    Route::patch('/catering/{cateringRequest}/status', [AdminCateringController::class, 'updateStatus'])->name('catering.update-status');
    
    // Cities Management
    Route::get('/cities', [CityController::class, 'index'])->name('cities.index');
    Route::post('/cities', [CityController::class, 'store'])->name('cities.store');
    Route::patch('/cities/{city}', [CityController::class, 'update'])->name('cities.update');
    Route::delete('/cities/{city}', [CityController::class, 'destroy'])->name('cities.destroy');
    
    // Weekly Menu Management
    Route::get('/weekly-menu', [WeeklyMenuController::class, 'index'])->name('weekly-menu.index');
    Route::post('/weekly-menu', [WeeklyMenuController::class, 'store'])->name('weekly-menu.store');
    Route::delete('/weekly-menu/{weeklyMenuOption}', [WeeklyMenuController::class, 'destroy'])->name('weekly-menu.destroy');
});
