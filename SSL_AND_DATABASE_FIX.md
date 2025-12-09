# SSL Setup and Database Fix Guide

## 🔒 Running SSL Setup Script on Server

### Method 1: Direct Execution (Recommended)

1. **SSH into your server:**
   ```bash
   ssh user@your-server-ip
   ```

2. **Navigate to your application directory:**
   ```bash
   cd /var/www/spice-loop
   # Or wherever your application is located
   ```

3. **Make the script executable (if not already):**
   ```bash
   chmod +x scripts/setup-ssl.sh
   ```

4. **Run the SSL setup script with sudo:**
   ```bash
   sudo bash scripts/setup-ssl.sh
   ```
   
   Or:
   ```bash
   sudo ./scripts/setup-ssl.sh
   ```

### Method 2: Using the Deploy Script

The `deploy-app.sh` script can automatically run the SSL setup:

```bash
sudo bash scripts/deploy-app.sh
```

When prompted, answer "y" to setup SSL certificate.

### Prerequisites for SSL Setup

Before running the SSL script, ensure:

1. **Domain DNS is configured:**
   - Your domain (e.g., `spiceloop.com`) must have an A record pointing to your server's IP
   - The script will verify this automatically

2. **Ports are open in Security Group/Firewall:**
   - Port 80 (HTTP) - required for Let's Encrypt verification
   - Port 443 (HTTPS) - for secure connections

3. **Nginx is installed and configured:**
   - The script will check and create configuration if needed

4. **You have an email address:**
   - Required for Let's Encrypt certificate notifications

### What the SSL Script Does

- Installs Certbot (if not already installed)
- Verifies domain DNS configuration
- Creates/updates Nginx configuration
- Obtains SSL certificate from Let's Encrypt
- Configures automatic renewal
- Updates your `.env` file with HTTPS URL

### Manual SSL Certificate Renewal

To manually renew or check SSL status:

```bash
sudo bash scripts/update-ssl.sh
```

---

## 🗄️ Fixing Database Error: SQLite Path Issue

### The Problem

The error message indicates:
```
Database file at path [radiance_db] does not exist. 
Ensure this is an absolute path to the database.
```

This happens when:
- `DB_CONNECTION=sqlite` is set in `.env`
- `DB_DATABASE=radiance_db` (which is a MySQL database name, not a SQLite file path)

### Solution 1: Switch to MySQL (Recommended)

Based on your project setup, you should be using MySQL, not SQLite.

1. **Edit your `.env` file on the server:**
   ```bash
   nano .env
   # or
   vi .env
   ```

2. **Update these lines:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=radiance_db
   DB_USERNAME=radiance_user
   DB_PASSWORD=radiance_user
   ```

3. **Clear Laravel config cache:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

4. **Verify MySQL database exists:**
   ```bash
   mysql -u radiance_user -p radiance_db
   ```
   
   If it doesn't exist, create it:
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE IF NOT EXISTS radiance_db;
   CREATE USER IF NOT EXISTS 'radiance_user'@'localhost' IDENTIFIED BY 'radiance_user';
   GRANT ALL PRIVILEGES ON radiance_db.* TO 'radiance_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Run migrations:**
   ```bash
   php artisan migrate
   ```

### Solution 2: Fix SQLite Path (If you want to use SQLite)

If you actually want to use SQLite, you need to provide an absolute path:

1. **Edit your `.env` file:**
   ```bash
   nano .env
   ```

2. **Update the database configuration:**
   ```env
   DB_CONNECTION=sqlite
   DB_DATABASE=/var/www/spice-loop/database/database.sqlite
   ```
   
   **Important:** Use the absolute path to your SQLite file, not just the database name.

3. **Ensure the SQLite file exists:**
   ```bash
   touch database/database.sqlite
   chmod 664 database/database.sqlite
   chown www-data:www-data database/database.sqlite
   ```

4. **Clear Laravel config cache:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

### Quick Fix Script

You can also use this one-liner to switch to MySQL:

```bash
cd /var/www/spice-loop && \
sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=mysql/' .env && \
php artisan config:clear && \
php artisan cache:clear
```

---

## 🔍 Troubleshooting

### SSL Issues

- **"Domain not pointing to server"**: Check your DNS A record
- **"Port 80 blocked"**: Open port 80 in your EC2 Security Group
- **"Certbot not found"**: The script will install it automatically

### Database Issues

- **"Access denied"**: Check MySQL user permissions
- **"Database doesn't exist"**: Create it using the commands above
- **"Connection refused"**: Ensure MySQL service is running: `sudo systemctl status mysql`

---

## 📝 Quick Reference Commands

```bash
# Run SSL setup
sudo bash scripts/setup-ssl.sh

# Update/renew SSL
sudo bash scripts/update-ssl.sh

# Fix database to MySQL
sed -i 's/DB_CONNECTION=.*/DB_CONNECTION=mysql/' .env
php artisan config:clear

# Check current database config
grep DB_CONNECTION .env
grep DB_DATABASE .env
```

