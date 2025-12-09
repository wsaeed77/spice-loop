# Fix: extension_dir Points to Wrong Location

## The Problem

Your `php.ini` has:
```ini
extension_dir = "C:\php\ext"
```

But your extensions are actually in:
```
C:\MAMP\bin\php\php8.2.2\ext
```

So PHP can't find `php_mbstring.dll` even though it's enabled in php.ini.

## Solution: Fix extension_dir in php.ini

### Step 1: Open php.ini

Open this file in a text editor:
```
C:\MAMP\bin\php\php8.2.2\php.ini
```

### Step 2: Find extension_dir

Search for:
```ini
extension_dir =
```

### Step 3: Update the Path

Change it to one of these:

**Option A: Relative path (recommended)**
```ini
extension_dir = "ext"
```

**Option B: Full absolute path**
```ini
extension_dir = "C:/MAMP/bin/php/php8.2.2/ext"
```

**Note:** Use forward slashes `/` or escaped backslashes `\\` in the path.

### Step 4: Save and Test

1. Save the php.ini file
2. Test in PowerShell:

```powershell
$env:PHPRC = "C:\MAMP\bin\php\php8.2.2\php.ini"
C:\MAMP\bin\php\php8.2.2\php.exe -m | Select-String mbstring
```

Should now show: `mbstring`

### Step 5: Run Seeder

```powershell
C:\MAMP\bin\php\php8.2.2\php.exe artisan db:seed
```

## Quick Fix Script

If you want to automate this, create a PowerShell script:

```powershell
$phpIni = "C:\MAMP\bin\php\php8.2.2\php.ini"
$content = Get-Content $phpIni
$content = $content -replace 'extension_dir\s*=\s*".*"', 'extension_dir = "ext"'
$content | Set-Content $phpIni
Write-Host "extension_dir updated to 'ext'"
```

## Verify After Fix

```powershell
$env:PHPRC = "C:\MAMP\bin\php\php8.2.2\php.ini"
C:\MAMP\bin\php\php8.2.2\php.exe -r "echo ini_get('extension_dir');"
```

Should show: `ext` or the full path to the ext directory.

## Alternative: Use Full Path in Extension Line

If you can't change extension_dir, you can use full paths in extension lines:

```ini
extension=C:/MAMP/bin/php/php8.2.2/ext/php_mbstring.dll
```

But fixing extension_dir is the better solution.

