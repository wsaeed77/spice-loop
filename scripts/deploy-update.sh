#!/bin/bash

# SpiceLoop - Quick Update Deployment Script
# Use this for subsequent deployments after initial setup

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

APP_DIR=$(pwd)
print_status "Updating application in: $APP_DIR"

# Pull latest code (if using git)
if [ -d .git ]; then
    print_status "Pulling latest code..."
    git pull origin main || git pull origin master
fi

# Install PHP dependencies
print_status "Installing PHP dependencies..."
composer install --optimize-autoloader --no-dev

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm ci

# Build frontend assets
print_status "Building frontend assets..."
npm run build

# Set permissions
print_status "Setting permissions..."
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR
chmod -R 775 $APP_DIR/storage
chmod -R 775 $APP_DIR/bootstrap/cache

# Run migrations
print_status "Running database migrations..."
php artisan migrate --force

# Clear and cache configuration
print_status "Optimizing application..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart queue workers
print_status "Restarting queue workers..."
supervisorctl restart spice-loop-worker:* || print_warning "Queue workers not running"

# Reload PHP-FPM
print_status "Reloading PHP-FPM..."
systemctl reload php8.2-fpm

print_status "Update complete!"

