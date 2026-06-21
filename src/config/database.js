require('dotenv').config();

let pool;

if (process.env.NODE_ENV === 'test' || process.env.USE_MOCK_DB === 'true') {
  const mockProfiles = [];

  pool = {
    async getConnection() {
      return {
        async execute(query, params = []) {
          if (query.includes('INSERT') || query.includes('UPDATE')) {
            const profile = {
              id: mockProfiles.length + 1,
              username: params[0],
              name: params[1],
              bio: params[2],
              location: params[3],
              blog: params[4],
              company: params[5],
              email: params[6],
              public_repos: params[7],
              public_gists: params[8],
              followers: params[9],
              following: params[10],
              avatar_url: params[11],
              profile_url: params[12],
              github_created_at: params[13],
              github_updated_at: params[14],
              top_languages: params[15],
              total_stars: params[16],
              forked_repos_count: params[17],
              original_repos_count: params[18],
              top_starred_repos: params[19],
              language_breakdown: params[20],
              last_repo_update: params[21],
              days_since_last_activity: params[22],
              profile_completeness_score: params[23],
              analyzed_at: new Date(),
              created_at: new Date(),
            };

            const existing = mockProfiles.findIndex((p) => p.username === params[0]);
            if (existing !== -1) {
              mockProfiles[existing] = profile;
            } else {
              mockProfiles.push(profile);
            }

            return [[]];
          }

          if (query.includes('SELECT *') && query.includes('WHERE username')) {
            const profile = mockProfiles.find((p) => p.username === params[0]);
            return [profile ? [profile] : []];
          }

          if (query.includes('SELECT *') && query.includes('ORDER BY')) {
            const limit = params[0];
            const offset = params[1];
            const page = Math.floor(offset / limit);
            return [mockProfiles.slice(offset, offset + limit)];
          }

          if (query.includes('COUNT(*)')) {
            return [[{ total: mockProfiles.length }]];
          }

          if (query.includes('DELETE')) {
            const idx = mockProfiles.findIndex((p) => p.username === params[0]);
            if (idx !== -1) mockProfiles.splice(idx, 1);
            return [[]];
          }

          return [[]];
        },
        release() {},
      };
    },
  };
} else {
  const mysql = require('mysql2/promise');
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

module.exports = pool;
