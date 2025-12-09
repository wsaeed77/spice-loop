# Fix: mb_strimwidth() Function Not Found in MAMP

## The Problem

Error: `Call to undefined function Termwind\ValueObjects\mb_strimwidth()`

This happens because the `mbstring` PHP extension is not enabled in your MAMP installation.

## Solution: Enable mbstring Extension in MAMP

### Step 1: Locate PHP Configuration File

1. Open MAMP
2. Go to **File → Preferences → PHP**
3. Note your PHP version (e.g., 8.2.2)
4. The `php.ini` file is located at:
   ```
   C:\MAMP\bin\php\php8.2.2\php.ini
   ```

### Step 2: Edit php.ini

1. Open the `php.ini` file in a text editor (as Administrator if needed)
2. Search for `;extension=mbstring` (note the semicolon at the start)
3. Remove the semicolon to uncomment it:
   ```ini
   ;extension=mbstring  ← Change this
   extension=mbstring   ← To this
   ```

### Step 3: Restart MAMP

1. Stop MAMP servers
2. Start MAMP servers again
3. The changes will take effect

### Step 4: Verify Extension is Loaded

Run this command to verify:

```bash
C:\MAMP\bin\php\php8.2.2\php.exe -m | findstr mbstring
```

If you see `mbstring` in the output, it's enabled!

Or check with:

```bash
C:\MAMP\bin\php\php8.2.2\php.exe -i | findstr mbstring
```

## Alternative: Quick Check

You can also check if mbstring is enabled by running:

```bash
C:\MAMP\bin\php\php8.2.2\php.exe -r "echo extension_loaded('mbstring') ? 'mbstring is enabled' : 'mbstring is NOT enabled';"
```

## After Enabling

Once mbstring is enabled, try running the seeder again:

```bash
C:\MAMP\bin\php\php8.2.2\php.exe artisan db:seed
```

## If You Can't Find the Line

If you can't find `;extension=mbstring` in php.ini:

1. Search for `extension_dir` in php.ini
2. Note the directory path (e.g., `extension_dir = "ext"`)
3. Add this line in the extensions section:
   ```ini
   extension=mbstring
   ```

## Common Issues

### Issue: Changes Don't Take Effect

**Solution:**
- Make sure you edited the correct php.ini file (the one MAMP is using)
- Restart MAMP completely
- Check which php.ini is being used:
  ```bash
  C:\MAMP\bin\php\php8.2.2\php.exe --ini
  ```

### Issue: Extension Still Not Found

**Solution:**
1. Verify the extension file exists:
   - Check: `C:\MAMP\bin\php\php8.2.2\ext\php_mbstring.dll`
2. If file doesn't exist, you may need to reinstall MAMP or download the extension
3. Make sure `extension_dir` in php.ini points to the correct directory

### Issue: Permission Denied

**Solution:**
- Right-click php.ini → Properties → Uncheck "Read-only"
- Or run your text editor as Administrator

## Required Extensions for Laravel

While you're at it, make sure these are also enabled:

```ini
extension=mbstring
extension=openssl
extension=pdo_mysql
extension=fileinfo
extension=curl
extension=gd
```

## Quick Fix Script

If you want to automate this, you can create a batch file:

```batch
@echo off
set PHP_INI=C:\MAMP\bin\php\php8.2.2\php.ini
set SEARCH=;extension=mbstring
set REPLACE=extension=mbstring

powershell -Command "(Get-Content '%PHP_INI%') -replace '%SEARCH%', '%REPLACE%' | Set-Content '%PHP_INI%'"
echo mbstring extension enabled. Please restart MAMP.
pause
```

Save as `enable_mbstring.bat` and run as Administrator.

## Verify After Fix

After enabling and restarting MAMP, verify with:

```bash
C:\MAMP\bin\php\php8.2.2\php.exe artisan db:seed
```

The seeder should now run without errors!

