#!/bin/bash

# SpiceLoop - SSL Certificate Setup Script with Certbot
# This script sets up Let's Encrypt SSL certificate for spiceloop.com

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

DOMAIN="spiceloop.com"
EMAIL=""
APP_DIR="/var/www/spice-loop"
NGINX_CONF="/etc/nginx/sites-available/spice-loop"

# Get email for SSL certificate
read -p "Enter email for SSL certificate notifications (required): " EMAIL
if [ -z "$EMAIL" ]; then
    print_error "Email is required for SSL certificate"
    exit 1
fi

print_status "Setting up SSL certificate for $DOMAIN..."

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    print_status "Installing Certbot..."
    apt-get update -qq
    apt-get install -y -qq certbot python3-certbot-nginx
else
    print_status "Certbot is already installed"
fi

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    print_error "Nginx is not installed. Please install Nginx first."
    exit 1
fi

# Check if domain is pointing to this server
print_status "Verifying domain configuration..."
PUBLIC_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

if [ -z "$DOMAIN_IP" ]; then
    print_warning "Could not resolve $DOMAIN. Make sure DNS is configured."
    read -p "Continue anyway? (y/N): " CONTINUE
    if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
        exit 1
    fi
elif [ "$DOMAIN_IP" != "$PUBLIC_IP" ]; then
    print_warning "Domain $DOMAIN points to $DOMAIN_IP, but server IP is $PUBLIC_IP"
    print_warning "Make sure your domain DNS A record points to this server"
    read -p "Continue anyway? (y/N): " CONTINUE
    if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
        exit 1
    fi
else
    print_status "Domain DNS is correctly configured"
fi

# Ensure Nginx configuration exists
if [ ! -f "$NGINX_CONF" ]; then
    print_status "Creating Nginx configuration..."
    cat > $NGINX_CONF <<NGINX_CONFIG
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    root $APP_DIR/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
NGINX_CONFIG

    # Enable site
    ln -sf $NGINX_CONF /etc/nginx/sites-enabled/spice-loop
    rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload Nginx
    nginx -t
    systemctl reload nginx
    print_status "Nginx configuration created"
fi

# Update Nginx config to include www subdomain if not already
if ! grep -q "www.$DOMAIN" $NGINX_CONF; then
    print_status "Updating Nginx configuration to include www subdomain..."
    sed -i "s/server_name $DOMAIN;/server_name $DOMAIN www.$DOMAIN;/" $NGINX_CONF
    nginx -t
    systemctl reload nginx
fi

# Check if certificate already exists
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    print_warning "SSL certificate for $DOMAIN already exists"
    read -p "Renew certificate? (y/N): " RENEW
    if [ "$RENEW" == "y" ] || [ "$RENEW" == "Y" ]; then
        print_status "Renewing SSL certificate..."
        certbot renew --cert-name $DOMAIN
        systemctl reload nginx
        print_status "Certificate renewed"
    else
        print_status "Using existing certificate"
    fi
else
    # Obtain SSL certificate
    print_status "Obtaining SSL certificate for $DOMAIN..."
    certbot --nginx \
        -d $DOMAIN \
        -d www.$DOMAIN \
        --non-interactive \
        --agree-tos \
        --email $EMAIL \
        --redirect
    
    if [ $? -eq 0 ]; then
        print_status "SSL certificate obtained successfully!"
    else
        print_error "Failed to obtain SSL certificate"
        exit 1
    fi
fi

# Update .env file with HTTPS URL
if [ -f "$APP_DIR/.env" ]; then
    print_status "Updating APP_URL in .env file..."
    sed -i "s|APP_URL=.*|APP_URL=https://$DOMAIN|" $APP_DIR/.env
    # Clear Laravel config cache
    if [ -f "$APP_DIR/artisan" ]; then
        cd $APP_DIR
        php artisan config:clear || true
    fi
fi

# Set up auto-renewal
print_status "Setting up automatic certificate renewal..."

# Add renewal hook to reload Nginx
if [ ! -f "/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh" ]; then
    mkdir -p /etc/letsencrypt/renewal-hooks/deploy
    cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'RENEWAL_HOOK'
#!/bin/bash
systemctl reload nginx
RENEWAL_HOOK
    chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
fi

# Test renewal
print_status "Testing certificate renewal..."
certbot renew --dry-run

# Add cron job for renewal check (if not already exists)
if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'") | crontab -
    print_status "Added cron job for automatic renewal"
fi

print_status "SSL setup complete!"
echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔒 SSL Certificate Configured!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "  🌐 Your site is now available at:"
echo "     https://$DOMAIN"
echo "     https://www.$DOMAIN"
echo
echo "  📋 Certificate location:"
echo "     /etc/letsencrypt/live/$DOMAIN/"
echo
echo "  🔄 Auto-renewal:"
echo "     - Certificates renew automatically"
echo "     - Renewal tested and configured"
echo "     - Cron job set up for daily checks"
echo
print_warning "Important: Make sure your EC2 Security Group allows:"
echo "  - Port 80 (HTTP) - for Let's Encrypt verification"
echo "  - Port 443 (HTTPS) - for secure connections"
echo




