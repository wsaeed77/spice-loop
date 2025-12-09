# Deployment Issues Fix

## Current Issues

### 1. PHP Version Mismatch
**Error:** `symfony/clock v8.0.0 requires php >=8.4 -> your php version (8.2.29) does not satisfy that requirement`

**Solution:** Update your EC2 server to PHP 8.4

### 2. Git Ownership Issue
**Error:** `fatal: detected dubious ownership in repository`

**Solution:** The deployment script now fixes this automatically

## Immediate Fix on EC2

Run these commands on your EC2 server:

```bash
# Update to PHP 8.4
sudo add-apt-repository -y ppa:ondrej/php
sudo apt-get update
sudo apt-get install -y php8.4-fpm php8.4-cli php8.4-common php8.4-mysql \
    php8.4-zip php8.4-gd php8.4-mbstring php8.4-curl php8.4-xml \
    php8.4-bcmath php8.4-intl

# Set PHP 8.4 as default
sudo update-alternatives --set php /usr/bin/php8.4

# Update Nginx to use PHP 8.4
sudo sed -i 's/php8.2-fpm/php8.4-fpm/g' /etc/nginx/sites-available/spice-loop
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl restart php8.4-fpm

# Verify PHP version
php -v  # Should show PHP 8.4.x
```

## Updated Deployment Script

The deployment script (`deploy.sh`) has been updated to:
- ✅ Fix git ownership automatically
- ✅ Use PHP 8.4 if available
- ✅ Handle composer superuser permissions
- ✅ Fallback to default PHP if 8.4 not found

## After Updating PHP

1. **Re-run the GitHub Actions workflow** - It should work now
2. Or **manually deploy**:
   ```bash
   cd /var/www/spice-loop
   sudo bash scripts/deploy-update.sh
   ```

## Verification

Check that everything is working:

```bash
# Check PHP version
php -v

# Check PHP-FPM status
sudo systemctl status php8.4-fpm

# Check Nginx config
sudo nginx -t

# Test composer
composer --version
```

## If PHP 8.4 Installation Fails

If PHP 8.4 is not available in the repository, you may need to:

1. **Wait for PHP 8.4 to be available** in the ondrej/php PPA
2. **Or regenerate composer.lock** for PHP 8.2 (may not work if dependencies truly require 8.4):
   ```bash
   rm composer.lock
   composer update --no-interaction
   ```

However, since your `composer.lock` requires PHP 8.4, updating the server to PHP 8.4 is the recommended solution.

