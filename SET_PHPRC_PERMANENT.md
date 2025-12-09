# Set PHPRC Environment Variable Permanently

## The Problem

When you run `php --ini`, it shows:
```
Loaded Configuration File: (none)
```

This means PHP CLI doesn't know where to find your `php.ini` file.

## Solution: Set PHPRC Environment Variable

### Method 1: Set for Current PowerShell Session (Temporary)

Run this in PowerShell:
```powershell
$env:PHPRC = "C:\MAMP\bin\php\php8.2.2\php.ini"
```

Then verify:
```powershell
C:\MAMP\bin\php\php8.2.2\php.exe --ini
```

Should now show:
```
Loaded Configuration File: C:\MAMP\bin\php\php8.2.2\php.ini
```

### Method 2: Set Permanently (Recommended)

#### Option A: Via Windows GUI

1. **Open System Properties:**
   - Press `Win + X`
   - Click "System"
   - Click "Advanced system settings" (on the right)

2. **Open Environment Variables:**
   - Click "Environment Variables" button

3. **Add New System Variable:**
   - Under "System variables", click "New"
   - Variable name: `PHPRC`
   - Variable value: `C:\MAMP\bin\php\php8.2.2\php.ini`
   - Click "OK" on all dialogs

4. **Restart PowerShell/Command Prompt:**
   - Close and reopen your terminal
   - The variable will now be set permanently

#### Option B: Via PowerShell (Run as Administrator)

```powershell
[System.Environment]::SetEnvironmentVariable('PHPRC', 'C:\MAMP\bin\php\php8.2.2\php.ini', 'Machine')
```

Then restart PowerShell.

#### Option C: Via Command Prompt (Run as Administrator)

```cmd
setx PHPRC "C:\MAMP\bin\php\php8.2.2\php.ini" /M
```

Then restart Command Prompt.

### Method 3: Create Batch File Wrapper

Create a file `php-mamp.bat` in a folder in your PATH (like `C:\Windows\` or create a `C:\bin\` folder):

```batch
@echo off
set PHPRC=C:\MAMP\bin\php\php8.2.2\php.ini
C:\MAMP\bin\php\php8.2.2\php.exe %*
```

Then you can use:
```batch
php-mamp artisan db:seed
```

## Verify It's Working

After setting PHPRC, test:

```powershell
# Check ini file is loaded
C:\MAMP\bin\php\php8.2.2\php.exe --ini

# Should show:
# Loaded Configuration File: C:\MAMP\bin\php\php8.2.2\php.ini

# Check mbstring is loaded
C:\MAMP\bin\php\php8.2.2\php.exe -m | Select-String mbstring

# Should show: mbstring

# Check function exists
C:\MAMP\bin\php\php8.2.2\php.exe -r "echo function_exists('mb_strimwidth') ? 'YES' : 'NO';"

# Should show: YES
```

## Quick Test Script

Create `test-php.ps1`:

```powershell
$env:PHPRC = "C:\MAMP\bin\php\php8.2.2\php.ini"

Write-Host "Checking PHP configuration..." -ForegroundColor Yellow
C:\MAMP\bin\php\php8.2.2\php.exe --ini

Write-Host "`nChecking mbstring..." -ForegroundColor Yellow
$mbstring = C:\MAMP\bin\php\php8.2.2\php.exe -m | Select-String mbstring
if ($mbstring) {
    Write-Host "✓ mbstring is loaded" -ForegroundColor Green
} else {
    Write-Host "✗ mbstring is NOT loaded" -ForegroundColor Red
}

Write-Host "`nChecking mb_strimwidth function..." -ForegroundColor Yellow
$result = C:\MAMP\bin\php\php8.2.2\php.exe -r "echo function_exists('mb_strimwidth') ? 'YES' : 'NO';"
if ($result -eq 'YES') {
    Write-Host "✓ mb_strimwidth function exists" -ForegroundColor Green
} else {
    Write-Host "✗ mb_strimwidth function NOT found" -ForegroundColor Red
}
```

Run it:
```powershell
.\test-php.ps1
```

## After Setting PHPRC Permanently

Once PHPRC is set permanently, you can run:

```powershell
C:\MAMP\bin\php\php8.2.2\php.exe artisan db:seed
```

And it should work without needing to set `$env:PHPRC` each time!

## Why This Happens

- **Web PHP (via MAMP):** MAMP's web server automatically tells PHP where php.ini is
- **CLI PHP:** Command line PHP doesn't know where to look unless you tell it via PHPRC

Setting PHPRC tells PHP CLI where to find the configuration file.

