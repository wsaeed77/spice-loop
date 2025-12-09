# SpiceLoop - EC2 Auto Deployment Guide

This guide will help you set up automated deployment for SpiceLoop on an EC2 instance.

## Prerequisites

- EC2 instance running Ubuntu (20.04 or later)
- Domain name (optional, but recommended)
- GitHub repository with your code
- AWS account with appropriate permissions

## Initial Server Setup

### Step 1: Connect to your EC2 instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 2: Run the server setup script

```bash
# Download or copy the setup script to your server
sudo bash setup-server.sh
```

The script will:
- Install PHP 8.2 and required extensions
- Install MySQL
- Install Node.js 18.x
- Install Composer
- Install Nginx
- Install Supervisor (for queue workers)
- Install Certbot (for SSL certificates)
- Create database and user

**Note:** You'll be prompted for:
- Domain name (or press Enter to use IP)
- Database name (default: `radiance_db` - matches existing setup)
- Database username (default: `radiance_user` - matches existing setup)
- Database password (default: `radiance_user` - matches existing setup)
- Application directory (default: `/var/www/spice-loop`)

**Note:** The default database credentials match your existing Radiance setup. You can press Enter to use defaults or enter different values.

### Step 3: Initial Application Deployment

After the server setup is complete:

1. **Upload your application code** to the server (or clone from Git):

```bash
cd /var/www/spice-loop
git clone https://github.com/your-username/spice-loop.git .
```

2. **Run the deployment script**:

```bash
sudo bash scripts/deploy-app.sh
```

The script will:
- Install PHP and Node.js dependencies
- Build frontend assets
- Set up environment file
- Configure Nginx
- Set up queue workers
- Configure Laravel scheduler
- Optionally set up SSL certificate

## Automated Deployment with GitHub Actions

There are two deployment workflows available:

### Option 1: Simple Git Pull Deployment (Recommended)

This workflow uses `git pull` directly on the server. It's simpler and doesn't require AWS credentials.

**Step 1: Configure GitHub Secrets**

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

1. **EC2_HOST** - Your EC2 instance IP or domain
2. **EC2_USER** - SSH user (usually `ubuntu` or `ec2-user`)
3. **EC2_SSH_KEY** - Your private SSH key (the entire content of your `.pem` file)
4. **EC2_PORT** - SSH port (optional, defaults to 22)
5. **EC2_APP_DIR** - Application directory (optional, defaults to `/var/www/spice-loop`)

**Step 2: Set up Git on EC2**

Make sure your code is cloned on the EC2 instance:

```bash
cd /var/www/spice-loop
git remote -v  # Should show your GitHub repository
```

**Step 3: Use the Simple Workflow**

The workflow file `.github/workflows/deploy-simple.yml` will:
- Pull latest code from Git
- Install dependencies
- Build frontend assets
- Run migrations
- Optimize Laravel
- Restart services

### Option 2: Package-Based Deployment

This workflow creates a deployment package and transfers it to EC2. Useful if you don't want Git on the server.

**Step 1: Configure GitHub Secrets**

Add all secrets from Option 1, plus:

1. **AWS_ACCESS_KEY_ID** - Your AWS access key
2. **AWS_SECRET_ACCESS_KEY** - Your AWS secret key
3. **AWS_REGION** - Your AWS region (e.g., `us-east-1`)

**Step 2: Configure Deployment**

The workflow file `.github/workflows/deploy.yml` will:
- Build frontend assets
- Install dependencies
- Create a deployment package
- Copy files to EC2 via SCP
- Run deployment script on the server

### Step 3: Trigger Deployment

Deployments are triggered automatically when you:
- Push to `main` or `master` branch
- Manually trigger via GitHub Actions UI (workflow_dispatch)

**Note:** To use the simple workflow, rename `deploy-simple.yml` to `deploy.yml` or keep both and choose which one to use.

## Manual Deployment

If you prefer manual deployment or need to update without Git:

### Quick Update (after initial setup)

```bash
cd /var/www/spice-loop
sudo bash scripts/deploy-update.sh
```

### Full Deployment

```bash
cd /var/www/spice-loop
sudo bash scripts/deploy-app.sh
```

## Environment Configuration

Make sure your `.env` file on the server has the following settings:

```env
APP_NAME=SpiceLoop
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=radiance_db
DB_USERNAME=radiance_user
DB_PASSWORD=radiance_user

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

WEEKLY_SUBSCRIPTION_CHARGE=50.00
```

## Post-Deployment Checklist

- [ ] Verify application is accessible
- [ ] Check SSL certificate is working (if configured)
- [ ] Test admin login
- [ ] Verify queue workers are running: `supervisorctl status`
- [ ] Check Laravel scheduler: `crontab -l`
- [ ] Verify file permissions on `storage` and `bootstrap/cache`
- [ ] Test database connection
- [ ] Review application logs: `tail -f storage/logs/laravel.log`

## Troubleshooting

### Queue Workers Not Running

```bash
sudo supervisorctl status
sudo supervisorctl restart spice-loop-worker:*
```

### Permission Issues

```bash
sudo chown -R www-data:www-data /var/www/spice-loop
sudo chmod -R 755 /var/www/spice-loop
sudo chmod -R 775 /var/www/spice-loop/storage
sudo chmod -R 775 /var/www/spice-loop/bootstrap/cache
```

### Clear Laravel Cache

```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

### Check Nginx Configuration

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### View Application Logs

```bash
tail -f /var/www/spice-loop/storage/logs/laravel.log
tail -f /var/www/spice-loop/storage/logs/worker.log
```

## Security Considerations

1. **Firewall**: Ensure your EC2 Security Group only allows:
   - Port 22 (SSH) from your IP
   - Port 80 (HTTP)
   - Port 443 (HTTPS)

2. **SSL Certificate**: Always use HTTPS in production. The deployment script can set up Let's Encrypt automatically.

3. **Environment File**: Never commit `.env` to Git. It should only exist on the server.

4. **Database**: Use strong passwords and restrict database access to localhost only.

5. **File Permissions**: Ensure proper file permissions are set (the scripts handle this automatically).

## Updating the Application

### Via GitHub Actions (Recommended)

Simply push to the `main` or `master` branch, and the workflow will automatically deploy.

### Manual Update

```bash
cd /var/www/spice-loop
git pull origin main
sudo bash scripts/deploy-update.sh
```

## Rollback

If you need to rollback to a previous version:

```bash
cd /var/www/spice-loop
git checkout <previous-commit-hash>
sudo bash scripts/deploy-update.sh
```

## Support

For issues or questions, please refer to:
- Laravel documentation: https://laravel.com/docs
- Nginx documentation: https://nginx.org/en/docs/
- Supervisor documentation: http://supervisord.org/

