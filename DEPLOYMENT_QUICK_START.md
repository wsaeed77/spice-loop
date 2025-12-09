# Quick Start - EC2 Deployment

## 🚀 Fast Setup (5 minutes)

### 1. Initial Server Setup (One-time)

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Run server setup
sudo bash scripts/setup-server.sh
```

### 2. Clone Your Repository

```bash
cd /var/www/spice-loop
git clone https://github.com/your-username/spice-loop.git .
```

### 3. Initial Deployment

```bash
sudo bash scripts/deploy-app.sh
```

### 4. Set Up Auto-Deployment

1. Go to GitHub → Your Repo → Settings → Secrets → Actions
2. Add these secrets:
   - `EC2_HOST` - Your EC2 IP
   - `EC2_USER` - `ubuntu` (or `ec2-user`)
   - `EC2_SSH_KEY` - Your private key (entire `.pem` file content)
   - `EC2_APP_DIR` - `/var/www/spice-loop` (optional)

3. Use the simple workflow: `.github/workflows/deploy-simple.yml`

That's it! Every push to `main` will auto-deploy. 🎉

## 📝 Manual Update (if needed)

```bash
cd /var/www/spice-loop
sudo bash scripts/deploy-update.sh
```

## 🔍 Check Status

```bash
# Check queue workers
sudo supervisorctl status

# Check application logs
tail -f /var/www/spice-loop/storage/logs/laravel.log

# Check Nginx
sudo systemctl status nginx
```

## ⚠️ Common Issues

**Permission denied?**
```bash
sudo chown -R www-data:www-data /var/www/spice-loop
sudo chmod -R 775 /var/www/spice-loop/storage
```

**Queue workers not running?**
```bash
sudo supervisorctl restart spice-loop-worker:*
```

**Need to clear cache?**
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

For detailed instructions, see [EC2_DEPLOYMENT.md](./EC2_DEPLOYMENT.md)

