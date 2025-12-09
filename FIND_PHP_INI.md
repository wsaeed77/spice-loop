# Finding the Correct php.ini File in MAMP

## Based on Your File Explorer

From your screenshot, I can see:
- `php.ini-development` - This is a **template file** (not active)
- `php` (labeled "INI-PRODUCTION") - This is likely the **actual php.ini file**

## How to Identify the Active php.ini

### Method 1: Check File Sizes
- `php.ini-development`: Template file (74 KB)
- `php` (INI-PRODUCTION): Active file (74 KB, modified 3/11/2025)

The one modified more recently is usually the active one.

### Method 2: Check File Contents

Open the file labeled "INI-PRODUCTION" (the one named `php`) and look for:
- `extension_dir` setting
- `extension=php_mbstring.dll` line

If it has these, it's the active php.ini.

### Method 3: Check MAMP Preferences

1. Open MAMP
2. Go to **File → Preferences → PHP**
3. It will show which php.ini file is being used

## The Issue

In MAMP, the active php.ini file might be:
- Named just `php` (without .ini extension)
- Or it might need to be copied/renamed

## Solution: Create or Use php.ini

### Option 1: Copy the Production Template

If the file named `php` is your active config:

1. **Rename it to php.ini:**
   - Right-click the file labeled "INI-PRODUCTION"
   - Rename it to `php.ini`

2. **Or copy it:**
   ```powershell
   Copy-Item "C:\MAMP\bin\php\php8.2.2\php" "C:\MAMP\bin\php\php8.2.2\php.ini"
   ```

### Option 2: Use the File Directly

If MAMP uses the file named `php` as the ini file, edit that file directly:

1. Open: `C:\MAMP\bin\php\php8.2.2\php`
2. Find `extension_dir`
3. Change it to: `extension_dir = "ext"`
4. Make sure `extension=php_mbstring.dll` is uncommented

## Verify Which File to Edit

Run this to see what PHP is looking for:

```powershell
C:\MAMP\bin\php\php8.2.2\php.exe --ini
```

Then check if that file exists. If it says "(none)", PHP isn't finding any ini file.

## Recommended Action

1. **Check MAMP Preferences** to see which file it uses
2. **Edit that file** (likely the one named `php` labeled "INI-PRODUCTION")
3. **Fix extension_dir** to `extension_dir = "ext"`
4. **Set PHPRC** environment variable to point to that file

## Quick Test

After editing, test:

```powershell
$env:PHPRC = "C:\MAMP\bin\php\php8.2.2\php"  # or php.ini if you renamed it
C:\MAMP\bin\php\php8.2.2\php.exe -m | Select-String mbstring
```

