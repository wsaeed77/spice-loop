# Fix: mbstring Not Loading in Command Line PHP

## The Problem

- **Web PHP (via MAMP):** mbstring is enabled ✅
- **Command Line PHP:** mbstring is NOT loaded ❌
- **Result:** `artisan db:seed` fails with `mb_strimwidth()` error

## Root Cause

When you run PHP from command line, it's not finding/loading the `php.ini` file that MAMP uses for web requests.

## Solution 1: Set PHPRC Environment Variable (Recommended)

### For Current Session:

In PowerShell, run:
```powershell
$env:PHPRC = "C:\MAMP\bin\php\php8.2.2\php.ini"
```

Then verify:
```powershell
C:\MAMP\bin\php\php8.2.2\php.exe -m | Select-String mbstring
```

### For Permanent Fix (Windows):

1. **Open System Environment Variables:**
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"

2. **Add New System Variable:**
   - Click "New" under "System variables"
   - Variable name: `PHPRC`
   - Variable value: `C:\MAMP\bin\php\php8.2.2\php.ini`
   - Click OK

3. **Restart Command Prompt/PowerShell**

4. **Verify:**
   ```powershell
   C:\MAMP\bin\php\php8.2.2\php.exe -m | Select-String mbstring
   ```

## Solution 2: Use php.ini Flag

Run artisan with explicit php.ini:

```powershell
C:\MAMP\bin\php\php8.2.2\php.exe -c "C:\MAMP\bin\php\php8.2.2\php.ini" artisan db:seed
```

## Solution 3: Create Batch File Wrapper

Create a file `artisan.bat` in your project root:

```batch
@echo off
set PHPRC=C:\MAMP\bin\php\php8.2.2\php.ini
C:\MAMP\bin\php\php8.2.2\php.exe artisan %*
```

Then you can run:
```batch
artisan db:seed
```

## Solution 4: Copy php.ini to Default Location

PHP CLI looks for php.ini in these locations (in order):
1. Current directory
2. PHP executable directory
3. Windows directory

You can copy the php.ini:
```batch
copy C:\MAMP\bin\php\php8.2.2\php.ini C:\MAMP\bin\php\php8.2.2\php.ini.cli
```

But this might cause conflicts, so Solution 1 is better.

## Quick Test

After applying Solution 1, test:

```powershell
# Set environment variable
$env:PHPRC = "C:\MAMP\bin\php\php8.2.2\php.ini"

# Verify mbstring is loaded
C:\MAMP\bin\php\php8.2.2\php.exe -m | Select-String mbstring

# Should show: mbstring

# Now run seeder
C:\MAMP\bin\php\php8.2.2\php.exe artisan db:seed
```

## Recommended Approach

**For immediate use:** Set PHPRC in your current PowerShell session:
```powershell
$env:PHPRC = "C:\MAMP\bin\php\php8.2.2\php.ini"
```

**For permanent fix:** Add PHPRC as a system environment variable (Solution 1 above).

## Why This Happens

- MAMP's web server loads php.ini automatically
- Command line PHP doesn't know where MAMP's php.ini is located
- Setting PHPRC tells PHP where to find the configuration file

## Verify It's Working

After setting PHPRC, check:

```powershell
C:\MAMP\bin\php\php8.2.2\php.exe --ini
```

Should now show:
```
Loaded Configuration File: C:\MAMP\bin\php\php8.2.2\php.ini
```

And:
```powershell
C:\MAMP\bin\php\php8.2.2\php.exe -m | Select-String mbstring
```

Should show: `mbstring`

