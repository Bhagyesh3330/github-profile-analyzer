# GitHub Profile Analyzer API

A Node.js Express backend service that analyzes GitHub user profiles using the GitHub public API and stores comprehensive insights in MySQL.

## Features

- **Fetch GitHub Profile Data**: Retrieve public profile information for any GitHub user
- **Deep Profile Analysis**: Extract top languages, starred repositories, contribution metrics, and profile completeness scores
- **Persistent Storage**: Store analysis results in MySQL for quick retrieval
- **RESTful API**: Easy-to-use endpoints for analyzing and fetching profiles
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Production Ready**: CORS enabled, error handling, and validation included

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **External API**: GitHub REST API v3
- **Dependencies**: axios, dotenv, cors, express-rate-limit

## Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
3. **GitHub Personal Access Token** - [Create one](https://github.com/settings/tokens)
   - Scope required: `public_repo` (read-only access to public repositories)

## Installation

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd github-profile-analyzer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# GitHub API Configuration
GITHUB_TOKEN=your_github_personal_access_token_here

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=github_analyzer

# Server Configuration
NODE_ENV=development
PORT=3000
```

### 4. Set Up Database

#### Option A: Using MySQL CLI

```bash
mysql -u root -p < database/schema.sql
```

#### Option B: Manual Setup

1. Open MySQL client:
```bash
mysql -u root -p
```

2. Run the schema:
```sql
SOURCE database/schema.sql;
```

### 5. Start the Server

For development (with nodemon):
```bash
npm run dev
```

For production:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### 1. Analyze GitHub Profile

**Endpoint**: `POST /api/profiles/analyze`

Fetches and analyzes a GitHub user profile, then stores it in the database.

**Request Body**:
```json
{
  "username": "octocat"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Profile analyzed and saved successfully",
  "data": {
    "id": 1,
    "username": "octocat",
    "name": "The Octocat",
    "bio": "GitHub's mascot",
    "location": "San Francisco",
    "blog": "https://github.blog",
    "company": "GitHub",
    "email": null,
    "public_repos": 2,
    "public_gists": 1,
    "followers": 3938,
    "following": 9,
    "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
    "profile_url": "https://github.com/octocat",
    "top_languages": ["JavaScript", "Ruby"],
    "total_stars": 1500,
    "forked_repos_count": 2,
    "original_repos_count": 8,
    "top_starred_repos": [
      {
        "name": "Hello-World",
        "stars": 1200,
        "url": "https://github.com/octocat/Hello-World",
        "description": "Sample repository"
      }
    ],
    "language_breakdown": {
      "JavaScript": 3,
      "Ruby": 2,
      "Python": 1
    },
    "profile_completeness_score": 83,
    "days_since_last_activity": 5,
    "analyzed_at": "2026-06-21T10:30:00.000Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "status": "error",
  "message": "Username is required and must be a string"
}
```

### 2. Get Single Profile

**Endpoint**: `GET /api/profiles/:username`

Retrieves a previously analyzed profile from the database.

**Example**: `GET /api/profiles/octocat`

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "username": "octocat",
    "name": "The Octocat",
    "bio": "GitHub's mascot",
    "followers": 3938,
    "top_languages": ["JavaScript", "Ruby"],
    "analyzed_at": "2026-06-21T10:30:00.000Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "status": "error",
  "message": "Profile for user \"octocat\" not found. Please analyze the profile first."
}
```

### 3. List All Profiles

**Endpoint**: `GET /api/profiles`

Retrieves all analyzed profiles with pagination.

**Query Parameters**:
- `page` (optional): Page number, default = 1
- `limit` (optional): Results per page (1-100), default = 10

**Example**: `GET /api/profiles?page=1&limit=10`

**Response** (200 OK):
```json
{
  "status": "success",
  "count": 2,
  "total": 25,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": 1,
      "username": "octocat",
      "name": "The Octocat",
      "followers": 3938,
      "profile_completeness_score": 83,
      "analyzed_at": "2026-06-21T10:30:00.000Z"
    },
    {
      "id": 2,
      "username": "torvalds",
      "name": "Linus Torvalds",
      "followers": 160000,
      "profile_completeness_score": 95,
      "analyzed_at": "2026-06-21T11:15:00.000Z"
    }
  ]
}
```

### 4. Delete Profile

**Endpoint**: `DELETE /api/profiles/:username`

Removes a profile from the database.

**Example**: `DELETE /api/profiles/octocat`

**Response** (200 OK):
```json
{
  "status": "success",
  "message": "Profile for user \"octocat\" deleted successfully"
}
```

### 5. Health Check

**Endpoint**: `GET /health`

Check if the API is running.

**Response** (200 OK):
```json
{
  "status": "OK",
  "timestamp": "2026-06-21T10:30:00.000Z"
}
```

## Database Schema

### Profiles Table

| Field | Type | Description |
|-------|------|-------------|
| id | INT | Primary key, auto-increment |
| username | VARCHAR(255) | GitHub username (UNIQUE) |
| name | VARCHAR(255) | Full name |
| bio | TEXT | User bio |
| location | VARCHAR(255) | Geographic location |
| blog | VARCHAR(255) | Website/blog URL |
| company | VARCHAR(255) | Company name |
| email | VARCHAR(255) | Email address (if public) |
| public_repos | INT | Number of public repositories |
| public_gists | INT | Number of public gists |
| followers | INT | Follower count |
| following | INT | Following count |
| avatar_url | VARCHAR(255) | Avatar image URL |
| profile_url | VARCHAR(255) | GitHub profile URL |
| top_languages | JSON | Array of top 5 programming languages |
| total_stars | INT | Total stars across all repos |
| forked_repos_count | INT | Number of forked repositories |
| original_repos_count | INT | Number of original repositories |
| top_starred_repos | JSON | Array of top 5 most starred repositories |
| language_breakdown | JSON | Language distribution object |
| last_repo_update | DATETIME | Last repository update timestamp |
| days_since_last_activity | INT | Days since last public activity |
| profile_completeness_score | INT | Profile completeness percentage (0-100) |
| analyzed_at | TIMESTAMP | Last analysis timestamp |
| created_at | TIMESTAMP | Record creation timestamp |

## Testing with Postman

A Postman collection is provided for easy testing. Import the collection from the `postman/` directory.

**Quick Test**:

1. **Analyze a Profile**:
   - Method: POST
   - URL: `http://localhost:3000/api/profiles/analyze`
   - Body (JSON):
   ```json
   {
     "username": "torvalds"
   }
   ```

2. **Get Profile**:
   - Method: GET
   - URL: `http://localhost:3000/api/profiles/torvalds`

3. **List All Profiles**:
   - Method: GET
   - URL: `http://localhost:3000/api/profiles?page=1&limit=5`

## Deployment to Railway or Render

### Railway.app

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app) and sign in
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add MySQL plugin
6. Set environment variables:
   - Copy from `.env.example`
   - Get MySQL connection details from Railway dashboard
   - Generate GitHub token
7. Deploy
8. Your API URL will be: `https://your-project-name.railway.app`

### Render.com

1. Push code to GitHub
2. Go to [Render.com](https://render.com) and sign in
3. Click "New" → "Web Service"
4. Connect GitHub repository
5. Create MySQL instance separately:
   - New Database → MySQL
6. Set Build & Start Commands:
   - Build: `npm install`
   - Start: `npm start`
7. Add environment variables
8. Deploy
9. Your API URL will be: `https://your-project-name.onrender.com`

## GitHub Token Setup

1. Go to [GitHub Settings](https://github.com/settings/tokens)
2. Click "Generate new token" (classic)
3. Give it a name: "GitHub Profile Analyzer"
4. Select scopes: `public_repo`
5. Generate token
6. Copy and paste into `.env` file as `GITHUB_TOKEN`

## Rate Limiting

The API implements rate limiting:
- **Limit**: 100 requests per 15 minutes per IP
- **Response**: 429 Too Many Requests if limit exceeded

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Ensure MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in `.env`

### GitHub Token Error
```
Error: GitHub API error: Bad credentials
```
- Verify GITHUB_TOKEN in `.env`
- Check token has not expired

### User Not Found
```
GitHub user "username" not found
```
- Verify the GitHub username exists
- Username is case-sensitive

## Project Structure

```
github-profile-analyzer/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── profileController.js
│   ├── routes/
│   │   └── profileRoutes.js
│   ├── services/
│   │   ├── githubService.js
│   │   └── profileService.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── app.js
├── database/
│   └── schema.sql
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## License

MIT License - feel free to use this project for personal and commercial purposes.

## Support

For issues or questions, open an issue in the GitHub repository.
