# Image Upload Setup Guide

## What Was Added

The menu management system now supports **image file uploads** in addition to image URLs. You can:
- Upload image files directly (JPEG, PNG, JPG, GIF, WEBP)
- Or continue using image URLs
- File upload takes priority if both are provided

## Server Setup Required

### Step 1: Create Storage Link

On your server, run this command to create a symbolic link from `public/storage` to `storage/app/public`:

```bash
cd /var/www/spice-loop
php artisan storage:link
```

This allows uploaded images to be accessible via the web.

### Step 2: Set Permissions

Ensure the storage directory is writable:

```bash
chmod -R 775 storage/app/public
chown -R www-data:www-data storage/app/public
```

### Step 3: Create Menu Items Directory

The images will be stored in `storage/app/public/menu-items/`. This directory will be created automatically when you upload the first image, but you can create it manually:

```bash
mkdir -p storage/app/public/menu-items
chmod 775 storage/app/public/menu-items
```

## How It Works

### File Upload Priority

1. If you upload a file, it will be used (even if you also enter a URL)
2. If you only enter a URL (no file), the URL will be used
3. If you upload a new file when editing, the old file will be deleted (if it was stored locally)

### Image Storage

- **Uploaded files:** Stored in `storage/app/public/menu-items/`
- **Accessible at:** `https://yourdomain.com/storage/menu-items/filename.jpg`
- **URLs:** Stored as-is in the database

### File Restrictions

- **Max file size:** 2MB
- **Allowed formats:** JPEG, PNG, JPG, GIF, WEBP
- **Validation:** Automatic on both frontend and backend

## Usage

### Creating a Menu Item

1. Go to `/admin/menu/create`
2. Fill in the form
3. In the Image section:
   - **Option A:** Click "Upload Image File" and select a file
   - **Option B:** Enter an image URL in the "Or Enter Image URL" field
4. Submit the form

### Editing a Menu Item

1. Go to `/admin/menu` and click "Edit" on any item
2. You'll see the current image (if it exists)
3. To change the image:
   - Upload a new file, OR
   - Enter a new URL
4. If you upload a new file, the old one will be deleted (if stored locally)

## Troubleshooting

### Images Not Displaying

1. **Check storage link:**
   ```bash
   ls -la public/storage
   ```
   Should show a symlink to `../storage/app/public`

2. **Recreate storage link:**
   ```bash
   php artisan storage:link --force
   ```

3. **Check permissions:**
   ```bash
   ls -la storage/app/public/menu-items
   ```

### Upload Fails

1. **Check file size:** Must be under 2MB
2. **Check file format:** Must be JPEG, PNG, JPG, GIF, or WEBP
3. **Check PHP upload limits:**
   ```bash
   php -i | grep upload_max_filesize
   php -i | grep post_max_size
   ```
   Both should be at least 2M

4. **Check storage permissions:**
   ```bash
   chmod -R 775 storage/app/public
   ```

### Old Images Not Deleting

The system only deletes old images if they were stored locally (in `/storage/`). External URLs are not deleted.

## File Structure

```
storage/
└── app/
    └── public/
        └── menu-items/
            ├── image1.jpg
            ├── image2.png
            └── ...
```

## Security Notes

- File uploads are validated for type and size
- Files are stored in the public directory (accessible via web)
- Consider adding image optimization/resizing in the future
- For production, consider using cloud storage (S3, etc.)

## Future Enhancements

Potential improvements:
- Image resizing/optimization
- Multiple image support
- Image cropping/editing
- Cloud storage integration (S3, etc.)
- Image compression

