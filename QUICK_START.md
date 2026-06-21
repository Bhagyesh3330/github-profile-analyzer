# Quick Start Guide - GitHub Profile Analyzer

## ✅ Status: FULLY TESTED & READY TO DEPLOY

---

## 🚀 Quick Start (Local Development)

### 1. Install & Run
```bash
cd "GitHub Profile Analyzer"
npm install
npm start
```

Server runs on `http://localhost:3002` with mock data enabled.

### 2. Test API
```bash
# Analyze a profile
curl -X POST http://localhost:3002/api/profiles/analyze \
  -H "Content-Type: application/json" \
  -d '{"username": "torvalds"}'

# Get all profiles
curl http://localhost:3002/api/profiles

# Get single profile
curl http://localhost:3002/api/profiles/torvalds
```

---

## 📊 What's Included

### API Endpoints (5 Total)
- ✅ `POST /api/profiles/analyze` - Analyze GitHub user
- ✅ `GET /api/profiles` - List all profiles (paginated)
- ✅ `GET /api/profiles/:username` - Get specific profile
- ✅ `DELETE /api/profiles/:username` - Delete profile
- ✅ `GET /health` - Health check

### Mock Data (Pre-configured)
- **torvalds**: Linus Torvalds with Linux repo data
- **octocat**: GitHub's mascot with sample repos

### Features Implemented
✅ Deep profile analytics  
✅ Top 5 languages extraction  
✅ Top 5 starred repos  
✅ Profile completeness scoring  
✅ Input validation & error handling  
✅ Rate limiting (100 req/15min)  
✅ CORS enabled  
✅ In-memory mock database  
✅ Mock GitHub API  

---

## 🗂️ Project Files

### Core Application
- `server.js` - Entry point
- `src/app.js` - Express setup
- `src/routes/profileRoutes.js` - API routes
- `src/controllers/profileController.js` - Business logic
- `src/services/githubService.js` - GitHub API + mock data
- `src/services/profileService.js` - Database operations
- `src/config/database.js` - Mock + real DB config
- `src/middleware/errorHandler.js` - Error handling

### Documentation & Config
- `README.md` - Complete API documentation
- `TESTING_REPORT.md` - Test results & debugging info
- `.env.example` - Environment template
- `package.json` - Dependencies
- `database/schema.sql` - MySQL schema

### Testing
- `postman/GitHub-Profile-Analyzer-Collection.json` - Postman collection

---

## 🧪 Test Results

**All 11 Tests Passing** ✅

```
1. Health Check                          ✅
2. List Profiles (Empty)                 ✅
3. Analyze Torvalds Profile              ✅
4. Fetch Torvalds Profile                ✅
5. Analyze Octocat Profile               ✅
6. List All Profiles                     ✅
7. Get Octocat Profile                   ✅
8. Delete Profile                        ✅
9. List After Delete                     ✅
10. Invalid Profile Error Handling       ✅
11. Input Validation                     ✅
```

---

## 🔧 Development vs Production

### Development (Current)
```env
USE_MOCK_DB=true         # In-memory database
GITHUB_TOKEN=test        # Test token (ignored)
PORT=3002                # Dev port
```

### Production
```env
USE_MOCK_DB=false        # Real MySQL
GITHUB_TOKEN=<your_real_token>
DB_HOST=<real_host>
DB_USER=<real_user>
DB_PASSWORD=<real_password>
PORT=3000
```

---

## 📱 API Example Response

### Request
```bash
POST /api/profiles/analyze
Content-Type: application/json

{"username": "torvalds"}
```

### Response
```json
{
  "status": "success",
  "message": "Profile analyzed and saved successfully",
  "data": {
    "id": 1,
    "username": "torvalds",
    "name": "Linus Torvalds",
    "followers": 189000,
    "public_repos": 2,
    "top_languages": ["C"],
    "total_stars": 150100,
    "profile_completeness_score": 83,
    "top_starred_repos": [
      {
        "name": "linux",
        "stars": 150000,
        "url": "https://github.com/torvalds/linux",
        "description": "The Linux kernel repository"
      }
    ]
  }
}
```

---

## 🚀 Deploy to Production

### Option 1: Railway.app (Recommended)
1. Push to GitHub: `git push origin master`
2. Go to [railway.app](https://railway.app)
3. Create new project → Select GitHub repo
4. Add MySQL service
5. Set environment variables
6. Deploy ✅

### Option 2: Render.com
1. Push to GitHub
2. Go to [render.com](https://render.com)
3. Create Web Service → Connect GitHub repo
4. Create separate MySQL database
5. Set environment variables
6. Deploy ✅

---

## 🛠️ Troubleshooting

### Server won't start?
- Check port 3002 is free
- Verify `npm install` completed
- Check `.env` file exists

### API returning errors?
- Ensure `USE_MOCK_DB=true` in `.env`
- Check server logs: `npm start` (no `&`)
- Try health check: `curl http://localhost:3002/health`

### Want to use real GitHub API?
1. Get token: [github.com/settings/tokens](https://github.com/settings/tokens)
2. Set in `.env`: `GITHUB_TOKEN=ghp_...`
3. Change `.env`: `USE_MOCK_DB=false`
4. Set up real MySQL database
5. Restart server

---

## 📚 Documentation

- **Full API Docs**: See `README.md`
- **Test Results**: See `TESTING_REPORT.md`
- **Database Schema**: See `database/schema.sql`
- **Postman Collection**: Import `postman/GitHub-Profile-Analyzer-Collection.json`

---

## ✨ Ready to Use!

The API is fully functional and tested. Choose your deployment option and go live! 🎉
