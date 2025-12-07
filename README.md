# SpiceLoop - Home Cooked Food Application

A modern Laravel + React (Inertia.js) application for managing a home-cooked food service business specializing in South Asian cuisine.

## Features

### 1. Weekly Subscription Service
- Customers can subscribe to weekly meal plans (Monday-Friday)
- Daily meal selection available for the next day
- Selection window closes at 12am
- Admin can set weekly menu options and subscription charges

### 2. Menu Ordering
- Dynamic menu with ordering functionality
- City-based availability
- Checkout form (payment integration can be added later)
- Admin can manage menu items and prices

### 3. Catering & Special Orders
- Form for catering requests
- Event details and special requirements
- Admin can view and manage all catering requests

### 4. Admin Panel
- Dashboard with statistics
- Menu management
- Order management
- Catering request management
- City management
- Weekly menu configuration

## Tech Stack

- **Backend:** Laravel 12
- **Frontend:** React 19 + Inertia.js
- **Styling:** Tailwind CSS 4
- **Authentication:** Laravel Sanctum
- **Permissions:** Spatie Laravel Permission

## Installation

1. Clone the repository:
```bash
git clone https://github.com/wsaeed77/spice-loop.git
cd spice-loop
```

2. Install dependencies:
```bash
composer install
npm install
```

3. Set up environment:
```bash
cp .env.example .env
php artisan key:generate
```

4. Configure database in `.env` (SQLite is used by default)

5. Run migrations and seeders:
```bash
php artisan migrate
php artisan db:seed
```

6. Start the development servers:

**Terminal 1:**
```bash
php artisan serve
```

**Terminal 2:**
```bash
npm run dev
```

7. Access the application:
- Homepage: http://localhost:8000
- Admin Login: http://localhost:8000/login
  - Email: admin@spiceloop.com
  - Password: password

## Default Admin Credentials

- **Email:** admin@spiceloop.com
- **Password:** password

⚠️ **Important:** Change the admin password in production!

## Application Structure

### Models
- `User` - Users with subscriber/admin roles
- `MenuItem` - Menu items
- `City` - Available cities for delivery
- `Subscription` - User subscriptions
- `WeeklyMenuOption` - Weekly menu configuration
- `DailySelection` - User daily meal selections
- `Order` - Customer orders
- `OrderItem` - Order line items
- `CateringRequest` - Catering requests

### Controllers
- `HomeController` - Homepage
- `MenuController` - Menu display
- `OrderController` - Order processing
- `SubscriptionController` - Subscription management
- `CateringController` - Catering requests
- `SubscriberController` - Subscriber dashboard
- `Admin/*` - Admin panel controllers

### React Components
- `Home.jsx` - Homepage with branding
- `Menu.jsx` - Menu with cart and checkout
- `Subscription.jsx` - Subscription form
- `Catering.jsx` - Catering request form
- `Auth/Login.jsx` - Login page
- `Subscriber/Dashboard.jsx` - Subscriber dashboard
- `Admin/Dashboard.jsx` - Admin dashboard

## Color Scheme

The application uses SpiceLoop brand colors:
- **Spice Red:** #8B0000
- **Spice Maroon:** #800020
- **Spice Orange:** #FF8C00
- **Spice Gold:** #FFD700
- **Spice Cream:** #FFF8DC

## Environment Variables

Add to `.env`:
```
WEEKLY_SUBSCRIPTION_CHARGE=50.00
```

## Production Deployment

1. Build assets:
```bash
npm run build
```

2. Optimize Laravel:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. Set up proper database (MySQL/PostgreSQL)

4. Configure web server (Nginx/Apache)

## License

MIT License
