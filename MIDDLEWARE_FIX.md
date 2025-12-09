# Middleware Fix for Spatie Permission

## The Problem

Error: `Target class [Spatie\Permission\Middlewares\RoleMiddleware] does not exist`

This happens because the middleware namespace is incorrect. In Spatie Permission v6, it's `Middleware` (singular), not `Middlewares` (plural).

## Solution

### Step 1: Fix the Middleware Registration

The file `bootstrap/app.php` has been fixed locally. You need to update it on the server:

**On Server (SSH):**

```bash
cd /var/www/spice-loop
nano bootstrap/app.php
```

Change these lines (around line 19-21):

**FROM:**
```php
'role' => \Spatie\Permission\Middlewares\RoleMiddleware::class,
'permission' => \Spatie\Permission\Middlewares\PermissionMiddleware::class,
'role_or_permission' => \Spatie\Permission\Middlewares\RoleOrPermissionMiddleware::class,
```

**TO:**
```php
'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
```

Save and exit (Ctrl+X, then Y, then Enter).

### Step 2: Ensure Package is Installed

```bash
cd /var/www/spice-loop
composer install --no-dev --optimize-autoloader
```

### Step 3: Clear All Caches

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
```

### Step 4: Rebuild Autoload

```bash
composer dump-autoload
```

### Step 5: Test

Try accessing the admin dashboard again:
```
https://spiceloop.com/admin/dashboard
```

---

## Quick One-Liner Fix

If you want to fix it quickly with sed:

```bash
cd /var/www/spice-loop && \
sed -i 's/Spatie\\Permission\\Middlewares/Spatie\\Permission\\Middleware/g' bootstrap/app.php && \
composer dump-autoload && \
php artisan config:clear && \
php artisan cache:clear
```

---

## Verify the Fix

Check that the middleware classes exist:

```bash
php artisan tinker
>>> class_exists(\Spatie\Permission\Middleware\RoleMiddleware::class);
=> true
>>> exit
```

If it returns `true`, the fix worked!

---

## Alternative: If Package Still Not Found

If you still get errors, the package might not be properly installed:

```bash
# Remove vendor and reinstall
rm -rf vendor composer.lock
composer install --no-dev --optimize-autoloader

# Publish Spatie config (if needed)
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# Clear everything
php artisan optimize:clear
composer dump-autoload
```

---

## Notes

- The fix has been applied to your local `bootstrap/app.php` file
- You need to either:
  1. Upload the fixed file to the server, OR
  2. Apply the same fix on the server using the commands above
- After fixing, always clear caches to ensure changes take effect

