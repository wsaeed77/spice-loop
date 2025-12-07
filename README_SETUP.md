# SpiceLoop - Setup and Run Instructions

## Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js and npm
- SQLite (or MySQL/PostgreSQL)

## Quick Start

### 1. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment file (if not already done)
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Setup

The project uses SQLite by default. Make sure `database/database.sqlite` exists:

```bash
# Run migrations
php artisan migrate

# (Optional) Create admin user and roles
php artisan db:seed
```

### 4. Run the Application

You need to run **two servers** simultaneously:

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```
This will start the Laravel server at `http://localhost:8000`

**Terminal 2 - Vite Dev Server (for React/Inertia):**
```bash
npm run dev
```
This will start the Vite development server for hot module replacement.

### 5. Access the Application

Open your browser and navigate to:
- **Homepage:** http://localhost:8000
- **Admin Panel:** http://localhost:8000/admin (after creating admin user)

## Alternative: Run Both Servers Together

You can use the Laravel dev script (if configured):

```bash
composer run dev
```

Or use a tool like `concurrently`:

```bash
npx concurrently "php artisan serve" "npm run dev"
```

## Building for Production

```bash
# Build assets
npm run build

# Run migrations
php artisan migrate --force
```

## Troubleshooting

1. **Port already in use:** Change the port: `php artisan serve --port=8001`
2. **Database errors:** Make sure `database/database.sqlite` exists and is writable
3. **Vite errors:** Clear cache: `npm run build` then `npm run dev`
4. **Permission errors:** Run `php artisan storage:link` and check file permissions

