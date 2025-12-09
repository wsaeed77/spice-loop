# GitHub Secrets Mapping

## Your Current Secrets

Based on your setup, you have:
- ✅ `SSH_HOST` or `SSH_HOSTNAME` - EC2 host/IP
- ✅ `SSH_KEY` - Private SSH key
- ✅ `SSH_PORT` - SSH port
- ✅ `DEPLOY_PATH` - Application directory

## Missing Secret

You need to add one more secret:

- **`SSH_USERNAME`** - SSH user (usually `ubuntu` or `ec2-user`)

## Quick Fix

1. Go to GitHub → Your Repo → Settings → Secrets → Actions
2. Click **New repository secret**
3. Add:
   - **Name:** `SSH_USERNAME`
   - **Value:** `ubuntu` (or `ec2-user` if that's your EC2 user)
4. Click **Add secret**

## Secret Name Support

The workflows now support multiple naming conventions:

### Host
- `SSH_HOST` ✅ (your current)
- `SSH_HOSTNAME` ✅ (your current)
- `EC2_HOST` (alternative)

### Username
- `SSH_USERNAME` ⚠️ (you need to add this)
- `EC2_USER` (alternative)
- Defaults to `ubuntu` if not set

### Key
- `SSH_KEY` ✅ (your current)
- `EC2_SSH_KEY` (alternative)

### Port
- `SSH_PORT` ✅ (your current)
- `EC2_PORT` (alternative)
- Defaults to `22` if not set

### App Directory
- `DEPLOY_PATH` ✅ (your current)
- `EC2_APP_DIR` (alternative)
- Defaults to `/var/www/spice-loop` if not set

## After Adding SSH_USERNAME

Once you add `SSH_USERNAME`, the workflow should work! The workflows will automatically use your secret names.

## Testing

After adding `SSH_USERNAME`:
1. Go to **Actions** tab
2. Click **Re-run jobs** → **Re-run failed jobs**
3. Or push a new commit to trigger the workflow

