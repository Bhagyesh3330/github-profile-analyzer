const pool = require('../config/database');
const { analyzeGitHubProfile } = require('./githubService');

async function saveOrUpdateProfile(profileData) {
  const connection = await pool.getConnection();

  try {
    const query = `
      INSERT INTO profiles (
        username, name, bio, location, blog, company, email,
        public_repos, public_gists, followers, following,
        avatar_url, profile_url, github_created_at, github_updated_at,
        top_languages, total_stars, forked_repos_count, original_repos_count,
        top_starred_repos, language_breakdown, last_repo_update,
        days_since_last_activity, profile_completeness_score, analyzed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        bio = VALUES(bio),
        location = VALUES(location),
        blog = VALUES(blog),
        company = VALUES(company),
        email = VALUES(email),
        public_repos = VALUES(public_repos),
        public_gists = VALUES(public_gists),
        followers = VALUES(followers),
        following = VALUES(following),
        avatar_url = VALUES(avatar_url),
        profile_url = VALUES(profile_url),
        github_created_at = VALUES(github_created_at),
        github_updated_at = VALUES(github_updated_at),
        top_languages = VALUES(top_languages),
        total_stars = VALUES(total_stars),
        forked_repos_count = VALUES(forked_repos_count),
        original_repos_count = VALUES(original_repos_count),
        top_starred_repos = VALUES(top_starred_repos),
        language_breakdown = VALUES(language_breakdown),
        last_repo_update = VALUES(last_repo_update),
        days_since_last_activity = VALUES(days_since_last_activity),
        profile_completeness_score = VALUES(profile_completeness_score),
        analyzed_at = CURRENT_TIMESTAMP
    `;

    const values = [
      profileData.username,
      profileData.name,
      profileData.bio,
      profileData.location,
      profileData.blog,
      profileData.company,
      profileData.email,
      profileData.public_repos,
      profileData.public_gists,
      profileData.followers,
      profileData.following,
      profileData.avatar_url,
      profileData.profile_url,
      profileData.github_created_at,
      profileData.github_updated_at,
      JSON.stringify(profileData.top_languages),
      profileData.total_stars,
      profileData.forked_repos_count,
      profileData.original_repos_count,
      JSON.stringify(profileData.top_starred_repos),
      JSON.stringify(profileData.language_breakdown),
      profileData.last_repo_update,
      profileData.days_since_last_activity,
      profileData.profile_completeness_score,
    ];

    await connection.execute(query, values);
    return await getProfileByUsername(profileData.username);
  } finally {
    connection.release();
  }
}

async function getProfileByUsername(username) {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM profiles WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return null;
    }

    const profile = rows[0];
    return formatProfile(profile);
  } finally {
    connection.release();
  }
}

async function getAllProfiles(limit = 10, offset = 0) {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM profiles ORDER BY analyzed_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM profiles');

    const profiles = Array.isArray(rows) ? rows : (rows ? [rows].filter(r => r) : []);

    return {
      profiles: profiles.map(formatProfile),
      total: countResult[0].total,
      limit,
      offset,
    };
  } finally {
    connection.release();
  }
}

async function analyzeAndSaveProfile(username) {
  const profileData = await analyzeGitHubProfile(username);
  return await saveOrUpdateProfile(profileData);
}

function formatProfile(profile) {
  return {
    id: profile.id,
    username: profile.username,
    name: profile.name,
    bio: profile.bio,
    location: profile.location,
    blog: profile.blog,
    company: profile.company,
    email: profile.email,
    public_repos: profile.public_repos,
    public_gists: profile.public_gists,
    followers: profile.followers,
    following: profile.following,
    avatar_url: profile.avatar_url,
    profile_url: profile.profile_url,
    github_created_at: profile.github_created_at,
    github_updated_at: profile.github_updated_at,
    top_languages: profile.top_languages ? JSON.parse(profile.top_languages) : [],
    total_stars: profile.total_stars,
    forked_repos_count: profile.forked_repos_count,
    original_repos_count: profile.original_repos_count,
    top_starred_repos: profile.top_starred_repos ? JSON.parse(profile.top_starred_repos) : [],
    language_breakdown: profile.language_breakdown ? JSON.parse(profile.language_breakdown) : {},
    last_repo_update: profile.last_repo_update,
    days_since_last_activity: profile.days_since_last_activity,
    profile_completeness_score: profile.profile_completeness_score,
    analyzed_at: profile.analyzed_at,
  };
}

async function deleteProfile(username) {
  const connection = await pool.getConnection();

  try {
    await connection.execute('DELETE FROM profiles WHERE username = ?', [username]);
    return true;
  } finally {
    connection.release();
  }
}

module.exports = {
  analyzeAndSaveProfile,
  getProfileByUsername,
  getAllProfiles,
  deleteProfile,
};
