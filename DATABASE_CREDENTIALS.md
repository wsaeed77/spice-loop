# Database Credentials

## Default Credentials (Matching Existing Setup)

The deployment scripts are configured to use the same database credentials as your existing Radiance application:

- **Database Name:** `radiance_db`
- **Database Username:** `radiance_user`
- **Database Password:** `radiance_user`

## Using Existing Database

Since you duplicated the EC2 instance, the database credentials are already set up. You have two options:

### Option 1: Use the Same Database (Shared)

If you want SpiceLoop to use the same database as Radiance, you can:
- Use the same database name: `radiance_db`
- Use the same user: `radiance_user`
- The tables will be separate (Laravel uses table prefixes if needed)

**Note:** Make sure table names don't conflict between applications.

### Option 2: Create a New Database

If you want a separate database for SpiceLoop:

1. Connect to MySQL:
```bash
sudo mysql
```

2. Create new database and user:
```sql
CREATE DATABASE spice_loop;
CREATE USER 'spice_user'@'localhost' IDENTIFIED BY 'spice_user';
GRANT ALL PRIVILEGES ON spice_loop.* TO 'spice_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. When running the deployment scripts, enter:
   - Database name: `spice_loop`
   - Username: `spice_user`
   - Password: `spice_user`

## Updating Scripts

The deployment scripts (`setup-server.sh` and `deploy-app.sh`) now default to:
- Database: `radiance_db`
- Username: `radiance_user`
- Password: `radiance_user`

You can press Enter to accept these defaults, or enter different values when prompted.

## Verifying Database Connection

Test the connection:

```bash
mysql -u radiance_user -p radiance_db
# Enter password: radiance_user
```

If it connects successfully, the credentials are correct!

