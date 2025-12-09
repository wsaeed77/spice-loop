# Database Restore Guide: Local to Server

Complete commands to restore your local database to the server.

## Prerequisites

- Local database name (likely `radiance_db` or `spice_loop`)
- Local MySQL username and password (MAMP default: `root` with empty password or `root`)
- Server IP address or hostname
- SSH access to server
- Server database credentials (`radiance_user` / `radiance_user`)

---

## Method 1: MySQL Dump (Recommended)

### Step 1: Export Database from Local (Windows/MAMP)

Open **PowerShell** or **Command Prompt** and navigate to your project:

```powershell
cd E:\Mamp\spice-loop
```

#### Option A: If MAMP MySQL is in PATH

```powershell
# Export database (replace with your actual database name)
mysqldump -u root -p radiance_db > database_backup.sql
# Enter your MySQL password when prompted
```

#### Option B: Using Full MAMP MySQL Path

```powershell
# For MAMP (adjust version if different)
& "C:\MAMP\bin\mysql\mysql8.x.x\bin\mysqldump.exe" -u root -p radiance_db > database_backup.sql
```

#### Option C: If MySQL password is empty (MAMP default)

```powershell
# If password is empty
mysqldump -u root radiance_db > database_backup.sql
```

#### Option D: Specify password directly (less secure)

```powershell
mysqldump -u root -pYourPassword radiance_db > database_backup.sql
```

**Note:** Replace `radiance_db` with your actual local database name.

---

### Step 2: Transfer SQL File to Server

#### Using SCP (from PowerShell or Git Bash):

```powershell
# Replace with your server details
scp database_backup.sql user@your-server-ip:/home/user/
```

**Example:**
```powershell
scp database_backup.sql ubuntu@54.123.45.67:/home/ubuntu/
```

#### Using WinSCP (GUI Alternative):

1. Download WinSCP: https://winscp.net/
2. Connect to your server
3. Drag and drop `database_backup.sql` to server

#### Using SFTP:

```powershell
sftp user@your-server-ip
put database_backup.sql
exit
```

---

### Step 3: Import Database on Server

SSH into your server:

```bash
ssh user@your-server-ip
```

Then run these commands:

```bash
# Navigate to where you uploaded the file (or move it)
cd ~

# Create database if it doesn't exist
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS radiance_db;"

# Import the database
mysql -u radiance_user -p radiance_db < database_backup.sql
# Enter password: radiance_user
```

**Or if you need to create the user first:**

```bash
# Login as root
mysql -u root -p

# Then run these SQL commands:
CREATE DATABASE IF NOT EXISTS radiance_db;
CREATE USER IF NOT EXISTS 'radiance_user'@'localhost' IDENTIFIED BY 'radiance_user';
GRANT ALL PRIVILEGES ON radiance_db.* TO 'radiance_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Now import
mysql -u radiance_user -p radiance_db < database_backup.sql
```

---

## Method 2: One-Line Command (Direct Transfer)

If you have SSH access and want to do it in one go:

### From Windows PowerShell (using Git Bash or WSL):

```powershell
# Export and transfer in one command
mysqldump -u root -p radiance_db | ssh user@your-server-ip "mysql -u radiance_user -p radiance_db"
```

### Or using plink (PuTTY):

```powershell
mysqldump -u root -p radiance_db | plink user@your-server-ip "mysql -u radiance_user -p radiance_db"
```

---

## Method 3: Complete Script (All-in-One)

Create a file `restore-db.ps1` on Windows:

```powershell
# restore-db.ps1
param(
    [string]$LocalDB = "radiance_db",
    [string]$LocalUser = "root",
    [string]$LocalPass = "",
    [string]$ServerUser = "ubuntu",
    [string]$ServerIP = "your-server-ip",
    [string]$ServerDB = "radiance_db",
    [string]$ServerDBUser = "radiance_user",
    [string]$ServerDBPass = "radiance_user"
)

$BackupFile = "database_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"

Write-Host "Exporting database..." -ForegroundColor Green
if ($LocalPass) {
    & "C:\MAMP\bin\mysql\mysql8.x.x\bin\mysqldump.exe" -u $LocalUser -p$LocalPass $LocalDB > $BackupFile
} else {
    & "C:\MAMP\bin\mysql\mysql8.x.x\bin\mysqldump.exe" -u $LocalUser $LocalDB > $BackupFile
}

Write-Host "Transferring to server..." -ForegroundColor Green
scp $BackupFile "${ServerUser}@${ServerIP}:/tmp/"

Write-Host "Importing on server..." -ForegroundColor Green
ssh "${ServerUser}@${ServerIP}" "mysql -u $ServerDBUser -p$ServerDBPass $ServerDB < /tmp/$BackupFile"

Write-Host "Cleaning up..." -ForegroundColor Green
ssh "${ServerUser}@${ServerIP}" "rm /tmp/$BackupFile"
Remove-Item $BackupFile

Write-Host "Database restored successfully!" -ForegroundColor Green
```

Run it:
```powershell
.\restore-db.ps1 -ServerIP "54.123.45.67"
```

---

## Quick Reference: Complete Command Sequence

### On Windows (PowerShell):

```powershell
# 1. Export
cd E:\Mamp\spice-loop
mysqldump -u root radiance_db > database_backup.sql

# 2. Transfer
scp database_backup.sql ubuntu@your-server-ip:/home/ubuntu/
```

### On Server (SSH):

```bash
# 3. Import
mysql -u radiance_user -p radiance_db < database_backup.sql
# Password: radiance_user

# 4. Verify
mysql -u radiance_user -p radiance_db -e "SHOW TABLES;"

# 5. Clear Laravel cache
cd /var/www/spice-loop
php artisan config:clear
php artisan cache:clear
```

---

## Troubleshooting

### Issue: "mysqldump: command not found"

**Solution:** Use full path to MAMP MySQL:
```powershell
& "C:\MAMP\bin\mysql\mysql8.x.x\bin\mysqldump.exe" -u root radiance_db > backup.sql
```

### Issue: "Access denied" on server

**Solution:** Check user permissions:
```bash
mysql -u root -p
GRANT ALL PRIVILEGES ON radiance_db.* TO 'radiance_user'@'localhost';
FLUSH PRIVILEGES;
```

### Issue: "Database doesn't exist" on server

**Solution:** Create it first:
```bash
mysql -u root -p -e "CREATE DATABASE radiance_db;"
```

### Issue: "scp: command not found" on Windows

**Solutions:**
- Use Git Bash (comes with Git for Windows)
- Use WinSCP (GUI)
- Use WSL (Windows Subsystem for Linux)
- Use PuTTY's pscp.exe

### Issue: Large database timeout

**Solution:** Compress before transfer:
```powershell
# Compress
Compress-Archive database_backup.sql database_backup.zip

# Transfer
scp database_backup.zip user@server:/home/user/

# On server: decompress and import
ssh user@server
unzip database_backup.zip
mysql -u radiance_user -p radiance_db < database_backup.sql
```

---

## Verify Database Restore

After importing, verify on server:

```bash
# Check tables
mysql -u radiance_user -p radiance_db -e "SHOW TABLES;"

# Check record counts
mysql -u radiance_user -p radiance_db -e "SELECT COUNT(*) as user_count FROM users;"

# Test Laravel connection
cd /var/www/spice-loop
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit
```

---

## Important Notes

1. **Backup server database first** (if it has data):
   ```bash
   mysql -u radiance_user -p radiance_db > server_backup_$(date +%Y%m%d).sql
   ```

2. **Check .env file** on server matches database credentials:
   ```bash
   grep DB_ /var/www/spice-loop/.env
   ```

3. **Run migrations** if schema changed:
   ```bash
   cd /var/www/spice-loop
   php artisan migrate
   ```

4. **Clear all caches** after restore:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   php artisan view:clear
   ```

