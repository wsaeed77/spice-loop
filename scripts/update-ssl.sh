#!/bin/bash

# SpiceLoop - SSL Certificate Update/Renewal Script
# Use this to manually renew or update SSL certificates

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

print_status "Checking SSL certificate status for $DOMAIN..."

# Check if certificate exists
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    print_error "SSL certificate for $DOMAIN not found"
    echo "Run: sudo bash scripts/setup-ssl.sh to set up SSL"
    exit 1
fi

# Show certificate info
print_status "Certificate information:"
certbot certificates

echo
read -p "What would you like to do? (renew/test/status): " ACTION

case $ACTION in
    renew)
        print_status "Renewing SSL certificate..."
        certbot renew --cert-name $DOMAIN
        systemctl reload nginx
        print_status "Certificate renewed and Nginx reloaded"
        ;;
    test)
        print_status "Testing certificate renewal (dry run)..."
        certbot renew --dry-run
        print_status "Renewal test completed"
        ;;
    status)
        print_status "Certificate status:"
        certbot certificates
        openssl x509 -in /etc/letsencrypt/live/$DOMAIN/cert.pem -noout -dates
        ;;
    *)
        print_error "Invalid action. Use: renew, test, or status"
        exit 1
        ;;
esac






