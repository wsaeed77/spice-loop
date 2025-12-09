# Install PHP 8.4 on EC2 - Required Before Deployment

## ⚠️ Critical: PHP 8.4 Required

Your `composer.lock` file requires PHP 8.4, but your EC2 server currently has PHP 8.2.29.

**You MUST install PHP 8.4 on your EC2 server before deployment will work.**

## Quick Installation Script

SSH into your EC2 server and run:

```bash
# Add PHP repository
sudo add-apt-repository -y ppa:ondrej/php
sudo apt-get update

# Install PHP 8.4 and all required extensions
sudo apt-get install -y php8.4-fpm php8.4-cli php8.4-common php8.4-mysql \
    php8.4-zip php8.4-gd php8.4-mbstring php8.4-curl php8.4-xml \
    php8.4-bcmath php8.4-intl

# Set PHP 8.4 as the default PHP version
sudo update-alternatives --set php /usr/bin/php8.4

# Verify installation
php -v
# Should show: PHP 8.4.x
```

## Update Nginx Configuration

After installing PHP 8.4, update your Nginx configuration:

```bash
# Update Nginx to use PHP 8.4-FPM
sudo sed -i 's/php8.2-fpm/php8.4-fpm/g' /etc/nginx/sites-available/spice-loop
# Or if you have a different config name:
sudo sed -i 's/php8.2-fpm/php8.4-fpm/g' /etc/nginx/sites-available/*

# Test Nginx configuration
sudo nginx -t

# Restart services
sudo systemctl restart nginx
sudo systemctl restart php8.4-fpm
```

## Verify Everything Works

```bash
# Check PHP version
php -v
# Should show PHP 8.4.x

# Check PHP-FPM status
sudo systemctl status php8.4-fpm

# Check Nginx status
sudo systemctl status nginx

# Test PHP-FPM socket
ls -la /var/run/php/php8.4-fpm.sock
```

## After Installation

Once PHP 8.4 is installed:

1. **Re-run the GitHub Actions workflow** - It will now pass the PHP version check
2. The deployment will automatically use PHP 8.4

## Alternative: If PHP 8.4 is Not Available

If PHP 8.4 is not available in the repository (shouldn't happen, but just in case):

1. **Wait for PHP 8.4** to be available in ondrej/php PPA
2. **Or regenerate composer.lock** for PHP 8.2 (may not work):
   ```bash
   # On your local machine with PHP 8.2
   rm composer.lock
   composer update --no-interaction
   git add composer.lock
   git commit -m "Update composer.lock for PHP 8.2"
   git push
   ```
   
   **Warning:** This may not work if Laravel 12 or dependencies truly require PHP 8.4.

## Troubleshooting

**"Package php8.4-fpm not found"**
- Make sure you've added the repository: `sudo add-apt-repository -y ppa:ondrej/php`
- Update package list: `sudo apt-get update`

**"update-alternatives: error: alternative path /usr/bin/php8.4 doesn't exist"**
- PHP 8.4 CLI might not be installed: `sudo apt-get install -y php8.4-cli`

**Nginx can't find php8.4-fpm.sock**
- Make sure PHP 8.4-FPM is running: `sudo systemctl start php8.4-fpm`
- Check socket path: `ls -la /var/run/php/php8.4-fpm.sock`

## One-Line Install (Copy & Paste)

```bash
sudo add-apt-repository -y ppa:ondrej/php && sudo apt-get update && sudo apt-get install -y php8.4-fpm php8.4-cli php8.4-common php8.4-mysql php8.4-zip php8.4-gd php8.4-mbstring php8.4-curl php8.4-xml php8.4-bcmath php8.4-intl && sudo update-alternatives --set php /usr/bin/php8.4 && sudo sed -i 's/php8.2-fpm/php8.4-fpm/g' /etc/nginx/sites-available/* && sudo nginx -t && sudo systemctl restart nginx && sudo systemctl restart php8.4-fpm && php -v
```

This will install PHP 8.4, update Nginx, restart services, and show the PHP version.

