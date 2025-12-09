#!/bin/bash

# SpiceLoop - Automated Server Setup Script for Ubuntu EC2
# This script will set up everything needed to deploy the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_status "Starting SpiceLoop server setup on Ubuntu..."

# Get deployment information
read -p "Enter your domain name (or press Enter to use IP address): " DOMAIN_NAME
read -p "Enter database name (default: radiance_db): " DB_NAME
DB_NAME=${DB_NAME:-radiance_db}
read -p "Enter database username (default: radiance_user): " DB_USER
DB_USER=${DB_USER:-radiance_user}
read -sp "Enter database password (default: radiance_user): " DB_PASSWORD
echo
DB_PASSWORD=${DB_PASSWORD:-radiance_user}
read -p "Enter application directory (default: /var/www/spice-loop): " APP_DIR
APP_DIR=${APP_DIR:-/var/www/spice-loop}

# Update system
print_status "Updating system packages..."
apt-get update -qq
apt-get upgrade -y -qq

# Install required packages
print_status "Installing required packages..."
apt-get install -y -qq \
    software-properties-common \
    curl \
    wget \
    git \
    unzip \
    zip \
    nginx \
    supervisor \
    certbot \
    python3-certbot-nginx

# Install PHP 8.4
print_status "Installing PHP 8.4 and extensions..."
add-apt-repository -y ppa:ondrej/php
apt-get update -qq
apt-get install -y -qq \
    php8.4-fpm \
    php8.4-cli \
    php8.4-common \
    php8.4-mysql \
    php8.4-zip \
    php8.4-gd \
    php8.4-mbstring \
    php8.4-curl \
    php8.4-xml \
    php8.4-bcmath \
    php8.4-intl

# Install MySQL
print_status "Installing MySQL..."
export DEBIAN_FRONTEND=noninteractive
apt-get install -y -qq mysql-server

# Start and enable MySQL
print_status "Starting MySQL service..."
systemctl start mysql
systemctl enable mysql

# Wait for MySQL to be ready
print_status "Waiting for MySQL to be ready..."
sleep 5

# Secure MySQL and create database
print_status "Setting up MySQL database..."

# Try to connect to MySQL (Ubuntu typically uses sudo mysql)
MYSQL_CONNECTED=false

if sudo mysql -e "SELECT 1" > /dev/null 2>&1; then
    # MySQL is accessible via sudo (default Ubuntu setup)
    print_status "Configuring MySQL with sudo access..."
    sudo mysql <<MYSQL_SCRIPT
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT
    MYSQL_CONNECTED=true
elif mysql -u root -e "SELECT 1" > /dev/null 2>&1; then
    # MySQL is accessible without password
    print_status "Configuring MySQL without password..."
    mysql -u root <<MYSQL_SCRIPT
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT
    MYSQL_CONNECTED=true
fi

if [ "$MYSQL_CONNECTED" = false ]; then
    # MySQL might need to be secured first
    print_warning "Could not automatically configure MySQL."
    print_warning "You may need to run MySQL setup manually."
    print_warning ""
    print_warning "Option 1: Run mysql_secure_installation"
    print_warning "  sudo mysql_secure_installation"
    print_warning ""
    print_warning "Option 2: Configure manually via sudo mysql"
    print_warning "  sudo mysql"
    print_warning "  Then run:"
    echo "    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';"
    echo "    CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
    echo "    CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
    echo "    GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
    echo "    FLUSH PRIVILEGES;"
    echo "    EXIT;"
    print_warning ""
    print_warning "After MySQL is configured, you can continue with the deployment."
fi

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y -qq nodejs

# Install Composer
print_status "Installing Composer..."
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Create application directory
print_status "Creating application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

print_status "Server setup complete!"
echo
print_warning "Next steps:"
echo "1. Upload your application code to: $APP_DIR"
echo "2. Run: cd $APP_DIR && sudo bash scripts/deploy-app.sh"
echo
echo "Database Details:"
echo "  Database: $DB_NAME"
echo "  Username: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo
print_status "System is ready for application deployment!"

