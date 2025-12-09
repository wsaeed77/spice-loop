# MySQL Setup Fix

If you encountered the MySQL authentication error during setup, here's how to fix it:

## Quick Fix

Since the script has already installed MySQL, you just need to configure it manually:

### Option 1: Using sudo mysql (Recommended)

```bash
sudo mysql
```

Then in the MySQL prompt, run:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'radiance_user';
CREATE DATABASE IF NOT EXISTS radiance_db;
CREATE USER IF NOT EXISTS 'radiance_user'@'localhost' IDENTIFIED BY 'radiance_user';
GRANT ALL PRIVILEGES ON radiance_db.* TO 'radiance_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Note:** Using default credentials (radiance_db/radiance_user) to match your existing setup.

### Option 2: Using mysql_secure_installation

```bash
sudo mysql_secure_installation
```

Follow the prompts, then manually create the database and user:

```bash
sudo mysql
```

```sql
CREATE DATABASE IF NOT EXISTS radiance_db;
CREATE USER IF NOT EXISTS 'radiance_user'@'localhost' IDENTIFIED BY 'radiance_user';
GRANT ALL PRIVILEGES ON radiance_db.* TO 'radiance_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Verify MySQL Setup

Test the connection:

```bash
mysql -u radiance_user -p radiance_db
```

Enter password: `radiance_user` when prompted. If it connects successfully, you're good to go!

## Continue Setup

After fixing MySQL, you can continue with the rest of the setup. The script should have already installed:
- ✅ PHP 8.2 and extensions
- ✅ MySQL (needs configuration)
- ⏳ Node.js (next step)
- ⏳ Composer (next step)

You can either:
1. **Continue manually** - Install Node.js and Composer, then run the deployment script
2. **Re-run the setup script** - It will skip already installed packages

## Updated Script

The setup script has been updated to handle MySQL authentication better. If you want to use the improved version:

```bash
# Download the updated script or pull from git
# Then re-run (it will skip already installed packages)
sudo bash scripts/setup-server.sh
```

The updated script will:
- Wait for MySQL to be ready
- Try multiple authentication methods
- Provide clear instructions if manual setup is needed

