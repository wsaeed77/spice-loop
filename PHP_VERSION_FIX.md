# PHP Version Fix

## Issue

Your `composer.lock` file contains dependencies that require PHP 8.4, but the server is running PHP 8.2.29.

## Quick Fix (On Server)

You have two options:

### Option 1: Update to PHP 8.4 (Recommended)

Since your dependencies require PHP 8.4, update your server:

```bash
# Add PHP repository
sudo add-apt-repository -y ppa:ondrej/php
sudo apt-get update

# Install PHP 8.4
sudo apt-get install -y php8.4-fpm php8.4-cli php8.4-common php8.4-mysql \
    php8.4-zip php8.4-gd php8.4-mbstring php8.4-curl php8.4-xml \
    php8.4-bcmath php8.4-intl

# Set PHP 8.4 as default
sudo update-alternatives --set php /usr/bin/php8.4

# Update Nginx configuration
sudo sed -i 's/php8.2-fpm/php8.4-fpm/g' /etc/nginx/sites-available/spice-loop
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl restart php8.4-fpm
```

### Option 2: Regenerate composer.lock for PHP 8.2

If you want to stick with PHP 8.2, you'll need to regenerate the lock file:

```bash
# Remove composer.lock
rm composer.lock

# Update composer to regenerate lock file compatible with PHP 8.2
composer update --no-interaction

# Note: This might downgrade some packages and may not work if Laravel 12 truly requires PHP 8.4
```

**Warning:** Option 2 may not work if Laravel 12 or its dependencies truly require PHP 8.4.

## Recommended Solution

**Use PHP 8.4** - The deployment scripts have been updated to install PHP 8.4 by default, which matches your `composer.lock` requirements.

## After Updating PHP

1. Verify PHP version:
```bash
php -v
# Should show PHP 8.4.x
```

2. Run composer install again:
```bash
composer install --optimize-autoloader --no-dev --no-interaction
```

3. Continue with deployment:
```bash
sudo bash scripts/deploy-app.sh
```

## Updated Scripts

All deployment scripts have been updated to use PHP 8.4:
- `scripts/setup-server.sh` - Installs PHP 8.4
- `scripts/deploy-app.sh` - Uses PHP 8.4-FPM socket
- `scripts/deploy-update.sh` - Reloads PHP 8.4-FPM
- `.github/workflows/deploy.yml` - Uses PHP 8.4
- `.github/workflows/deploy-simple.yml` - Uses PHP 8.4

