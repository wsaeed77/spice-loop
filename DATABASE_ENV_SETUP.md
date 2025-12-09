# Database .env Setup

## Current Issue

The deployment is failing because the `.env` file either:
1. Doesn't exist, or
2. Has incorrect database credentials

## Quick Fix

SSH into your EC2 server and create/update the `.env` file:

```bash
cd /var/www/spice-loop

# If .env doesn't exist, copy from example
if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate
fi

# Edit .env file with your database credentials
nano .env
```

## Required .env Settings

Make sure your `.env` file has these database settings:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=radiance_db
DB_USERNAME=radiance_user
DB_PASSWORD=radiance_user
```

## Complete .env Template

Here's a complete `.env` template with your database credentials:

```env
APP_NAME=SpiceLoop
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=radiance_db
DB_USERNAME=radiance_user
DB_PASSWORD=radiance_user

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

WEEKLY_SUBSCRIPTION_CHARGE=50.00
```

## Generate App Key

If you need to generate a new app key:

```bash
cd /var/www/spice-loop
php artisan key:generate
```

## Verify Database Connection

Test the database connection:

```bash
php artisan tinker
# Then in tinker:
DB::connection()->getPdo();
# Should connect successfully
```

Or test directly:

```bash
mysql -u radiance_user -p radiance_db
# Enter password: radiance_user
```

## After Setting Up .env

1. **Re-run the GitHub Actions workflow** - It should now be able to run migrations
2. Or **manually run migrations**:
   ```bash
   cd /var/www/spice-loop
   php artisan migrate --force
   ```

## Automated Setup Script

You can also run this script to set up .env automatically:

```bash
cd /var/www/spice-loop

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate
fi

# Update database credentials
sed -i 's/DB_DATABASE=.*/DB_DATABASE=radiance_db/' .env
sed -i 's/DB_USERNAME=.*/DB_USERNAME=radiance_user/' .env
sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=radiance_user/' .env
sed -i 's/APP_ENV=.*/APP_ENV=production/' .env
sed -i 's/APP_DEBUG=.*/APP_DEBUG=false/' .env

# Set permissions
chown www-data:www-data .env
chmod 600 .env

echo "✅ .env file configured"
```

## Troubleshooting

**"Access denied for user 'root'@'localhost'"**
- The .env file is trying to use 'root' user
- Make sure DB_USERNAME is set to `radiance_user`

**"Unknown database 'radiance_db'"**
- The database doesn't exist
- Create it: `mysql -u root -p -e "CREATE DATABASE radiance_db;"`

**".env file not found"**
- Copy from .env.example: `cp .env.example .env`
- Generate key: `php artisan key:generate`

