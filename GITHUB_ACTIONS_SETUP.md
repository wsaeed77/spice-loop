# GitHub Actions Setup Guide

## Error: AWS_REGION Missing

If you see the error: `Error: Input required and not supplied: aws-region`, you need to configure GitHub Secrets.

## Quick Fix

### Option 1: Use Simple Workflow (Recommended - No AWS Credentials Needed)

The simple workflow (`deploy-simple.yml`) doesn't require AWS credentials. It uses `git pull` directly on your server.

**To use it:**

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add these secrets (AWS credentials NOT needed):
   - `EC2_HOST` - Your EC2 IP or domain (e.g., `54.123.45.67`)
   - `EC2_USER` - SSH user (usually `ubuntu` or `ec2-user`)
   - `EC2_SSH_KEY` - Your private SSH key (entire `.pem` file content)
   - `EC2_PORT` - SSH port (optional, default: `22`)
   - `EC2_APP_DIR` - App directory (optional, default: `/var/www/spice-loop`)

3. Make sure your code is cloned on EC2:
   ```bash
   cd /var/www/spice-loop
   git remote -v  # Should show your GitHub repo
   ```

4. The workflow will automatically use `deploy-simple.yml` if it's the only one, or you can disable `deploy.yml` and keep only `deploy-simple.yml`

### Option 2: Package-Based Deployment (No AWS Credentials Needed)

The package-based workflow (`deploy.yml`) also uses SSH, so no AWS credentials are needed. It uses the same secrets as Option 1.

## Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:
   - Name: `EC2_HOST`
   - Value: Your EC2 IP address or domain
   - Click **Add secret**
5. Repeat for all required secrets

## Required Secrets Summary

### For Simple Workflow (deploy-simple.yml)
- ✅ `EC2_HOST`
- ✅ `EC2_USER`
- ✅ `EC2_SSH_KEY`
- ❌ AWS credentials NOT needed

### For Package Workflow (deploy.yml)
- ✅ `EC2_HOST`
- ✅ `EC2_USER`
- ✅ `EC2_SSH_KEY`
- ✅ `EC2_PORT` (optional)
- ✅ `EC2_APP_DIR` (optional)
- ❌ AWS credentials NOT needed (uses SSH directly)

## Testing the Workflow

After adding secrets:

1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. Click **Re-run jobs** → **Re-run failed jobs**
4. Or push a new commit to trigger the workflow

## Troubleshooting

**"Permission denied (publickey)"**
- Make sure `EC2_SSH_KEY` contains the entire private key (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)

**"Host key verification failed"**
- The EC2 host might not be in known_hosts. The workflow should handle this automatically, but if it doesn't, you may need to add the host key manually.

**"AWS_REGION required"**
- This error shouldn't occur anymore as AWS credentials are not needed. Both workflows use SSH directly. If you see this error, make sure you're using the latest version of the workflow files.

## Recommendation

**Use the simple workflow** (`deploy-simple.yml`) - it's easier to set up and doesn't require AWS credentials. The package-based workflow is only needed if you don't want Git on your server.

