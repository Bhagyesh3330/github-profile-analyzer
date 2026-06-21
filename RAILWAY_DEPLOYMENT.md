# Railway.app Deployment Guide

## ✅ Repository Ready
- **GitHub Repo**: https://github.com/Bhagyesh3330/github-profile-analyzer
- **Status**: Code pushed and ready

---

## 🚀 Deployment Steps (5 minutes)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Sign up" (use GitHub login)
3. Authorize Railway to access your GitHub account

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Search for "github-profile-analyzer"
4. Click to select it
5. Click "Create project"

### Step 3: Add MySQL Database
1. Click "Add service" or "+" button
2. Select "MySQL"
3. Accept defaults
4. Database will be created automatically

### Step 4: Configure Node.js Server
1. In the GitHub integration settings, click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Once deployed, click on "Node" service

### Step 5: Set Environment Variables
1. In the Node service, click "Variables"
2. Add these variables:

```
GITHUB_TOKEN=<Your GitHub Personal Access Token>

DB_HOST=<Copy from MySQL service dashboard>
DB_USER=<Usually 'root' or from MySQL service>
DB_PASSWORD=<Copy from MySQL service>
DB_NAME=github_analyzer

NODE_ENV=production
PORT=3000
USE_MOCK_DB=false
```

**To get your GitHub token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "GitHub Profile Analyzer Production"
4. Scopes: select `public_repo`
5. Generate and copy the token
6. Paste into Railway GITHUB_TOKEN variable

### Step 6: Get Database Credentials
1. Click on "MySQL" service
2. Click "Data" tab
3. Copy connection string details or view variables:
   - DB_HOST
   - DB_USER  
   - DB_PASSWORD

### Step 7: Create Database Schema
1. From MySQL service, click "Terminal" or "Web Terminal"
2. Run:
```bash
mysql -h [DB_HOST] -u [DB_USER] -p[DB_PASSWORD] < database/schema.sql
```
Or just paste the SQL:
```sql
-- From database/schema.sql
CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;
-- ... rest of schema
```

### Step 8: Deploy
1. Click "Redeploy" button in Node service
2. Wait for deployment to complete
3. Check "Deployments" tab for success

### Step 9: Get Live URL
1. Click on "Node" service
2. Look for "Service" or "Domain" section
3. Your API URL is shown there
4. Example: `https://github-profile-analyzer-production.railway.app`

---

## ✅ Verify Deployment

Test your live API:

```bash
# Health check
curl https://your-api-url/health

# Analyze profile
curl -X POST https://your-api-url/api/profiles/analyze \
  -H "Content-Type: application/json" \
  -d '{"username": "torvalds"}'

# Get all profiles
curl https://your-api-url/api/profiles
```

---

## 🔑 Important Notes

### Environment Variables
- **GITHUB_TOKEN**: Keep secure, rotate periodically
- **DB_PASSWORD**: Railway keeps it encrypted
- **USE_MOCK_DB**: Must be `false` for production
- **NODE_ENV**: Must be `production`

### Database
- Railway MySQL automatically backs up
- Persistent storage included
- Can scale as needed

### Auto-Deploy
- Every push to GitHub auto-deploys
- Takes 2-3 minutes
- Check "Deployments" tab for status

### Monitoring
- View logs in Railway dashboard
- Check metrics for performance
- Set up alerts if needed

---

## 🎯 Your Live API URL

Once deployed, your API will be at:
```
https://github-profile-analyzer-[random].railway.app
```

### Full API Documentation

**POST /api/profiles/analyze**
```bash
curl -X POST https://your-api-url/api/profiles/analyze \
  -H "Content-Type: application/json" \
  -d '{"username": "torvalds"}'
```

**GET /api/profiles**
```bash
curl https://your-api-url/api/profiles?page=1&limit=10
```

**GET /api/profiles/:username**
```bash
curl https://your-api-url/api/profiles/torvalds
```

**DELETE /api/profiles/:username**
```bash
curl -X DELETE https://your-api-url/api/profiles/torvalds
```

**GET /health**
```bash
curl https://your-api-url/health
```

---

## 🔐 Security Reminders

1. **Revoke token** after setting up production:
   - Go to [github.com/settings/tokens](https://github.com/settings/tokens)
   - Delete "GitHub Profile Analyzer" token
   - Create new token just for production

2. **Keep .env.example** in GitHub but never commit .env

3. **Rotate passwords** regularly

4. **Monitor logs** for suspicious activity

---

## 📞 Support

- Railway docs: https://docs.railway.app
- GitHub API docs: https://docs.github.com/en/rest
- API issues: Check server logs in Railway dashboard

---

## 🚀 You're Ready!

Your GitHub Profile Analyzer API is production-ready and fully tested.
Time to deploy! 🎉
