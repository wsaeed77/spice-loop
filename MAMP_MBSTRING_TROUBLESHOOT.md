# Troubleshooting mbstring Extension in MAMP

## Issue: mbstring is enabled but mb_strimwidth() still not found

Even though `extension=php_mbstring.dll` is in your php.ini, the function might not be loading. Here's how to fix it:

## Step 1: Verify Extension is Actually Loaded

Run this command to check if mbstring is actually loaded:

```bash
C:\MAMP\bin\php\php8.2.2\php.exe -m
```

Look for `mbstring` in the list. If it's NOT there, the extension isn't loading.

## Step 2: Check Extension Directory

1. Open `C:\MAMP\bin\php\php8.2.2\php.ini`
2. Find the line: `extension_dir =`
3. Make sure it points to the correct directory, for example:
   ```ini
   extension_dir = "ext"
   ```
   Or with full path:
   ```ini
   extension_dir = "C:/MAMP/bin/php/php8.2.2/ext"
   ```

## Step 3: Verify DLL File Exists

Check if the mbstring DLL file exists:

```bash
dir C:\MAMP\bin\php\php8.2.2\ext\php_mbstring.dll
```

If the file doesn't exist, that's the problem!

## Step 4: Check for Errors

Run PHP with error reporting to see if there are loading errors:

```bash
C:\MAMP\bin\php\php8.2.2\php.exe -r "echo 'mbstring loaded: ' . (extension_loaded('mbstring') ? 'YES' : 'NO');"
```

## Step 5: Check PHP Version Compatibility

`mb_strimwidth()` was added in PHP 7.1.0. Make sure you're using PHP 8.2.2 (which you are), so that's fine.

## Step 6: Verify Function Exists

Test if the function exists:

```bash
C:\MAMP\bin\php\php8.2.2\php.exe -r "echo function_exists('mb_strimwidth') ? 'Function exists' : 'Function NOT found';"
```

## Common Solutions

### Solution 1: Use Full Path for Extension

In php.ini, try using the full path:

```ini
extension=C:/MAMP/bin/php/php8.2.2/ext/php_mbstring.dll
```

Instead of:

```ini
extension=php_mbstring.dll
```

### Solution 2: Check Extension Order

Make sure mbstring is loaded before other extensions that might depend on it. Move it higher in the php.ini file.

### Solution 3: Restart MAMP Completely

1. Stop MAMP
2. Close MAMP application completely
3. Start MAMP again
4. Start servers

### Solution 4: Check for Conflicting Extensions

Sometimes other extensions can cause issues. Try temporarily commenting out other extensions to see if mbstring loads.

### Solution 5: Reinstall mbstring Extension

If the DLL is missing or corrupted:

1. Download PHP 8.2.2 Windows binaries
2. Extract `php_mbstring.dll` from the zip
3. Copy it to `C:\MAMP\bin\php\php8.2.2\ext\`
4. Restart MAMP

### Solution 6: Use Thread Safe (TS) vs Non-Thread Safe (NTS)

Make sure you're using the correct version:
- If MAMP uses Thread Safe PHP, use `php_mbstring.dll` (TS)
- If MAMP uses Non-Thread Safe PHP, you might need NTS version

Check your PHP info:
```bash
C:\MAMP\bin\php\php8.2.2\php.exe -i | findstr "Thread"
```

## Quick Diagnostic Script

Create a file `check_mbstring.php`:

```php
<?php
echo "PHP Version: " . PHP_VERSION . "\n";
echo "mbstring extension loaded: " . (extension_loaded('mbstring') ? 'YES' : 'NO') . "\n";
echo "mb_strimwidth function exists: " . (function_exists('mb_strimwidth') ? 'YES' : 'NO') . "\n";

if (extension_loaded('mbstring')) {
    echo "mbstring version: " . phpversion('mbstring') . "\n";
    echo "Available mbstring functions: " . count(get_extension_funcs('mbstring')) . "\n";
} else {
    echo "ERROR: mbstring extension is NOT loaded!\n";
    echo "Check php.ini and extension_dir setting.\n";
}
```

Run it:
```bash
C:\MAMP\bin\php\php8.2.2\php.exe check_mbstring.php
```

## Alternative: Use Different PHP Version

If mbstring still doesn't work with PHP 8.2.2:

1. Try switching to PHP 8.1 or 8.0 in MAMP
2. Or update to the latest PHP 8.2.x version in MAMP

## If Nothing Works

As a last resort, you can work around this by:

1. Using a different terminal/command prompt that has mbstring enabled
2. Running the seeder on your server instead of locally
3. Using Laravel Sail or Docker for local development

## Most Likely Issue

Based on the error, the most common cause is:
- **Extension DLL file is missing or corrupted**
- **extension_dir is pointing to wrong location**
- **MAMP needs a complete restart (not just servers)**

Try these in order:
1. Verify DLL exists: `dir C:\MAMP\bin\php\php8.2.2\ext\php_mbstring.dll`
2. Check extension_dir in php.ini
3. Completely restart MAMP (close and reopen)
4. Run the diagnostic script above

