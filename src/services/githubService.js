const axios = require('axios');
require('dotenv').config();

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubClient = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

async function fetchUserProfile(username) {
  try {
    const response = await githubClient.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`GitHub user "${username}" not found`);
    }
    throw new Error(`GitHub API error: ${error.message}`);
  }
}

async function fetchUserRepositories(username) {
  try {
    const repos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await githubClient.get(`/users/${username}/repos`, {
        params: {
          per_page: 100,
          page,
          sort: 'updated',
          direction: 'desc',
        },
      });

      repos.push(...response.data);
      hasMore = response.data.length === 100;
      page++;

      if (repos.length >= 300) break;
    }

    return repos;
  } catch (error) {
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
}

function calculateLanguageStats(repos) {
  const languageCounts = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  return Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang]) => lang);
}

function calculateTopStarredRepos(repos) {
  return repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count,
      url: repo.html_url,
      description: repo.description,
    }));
}

function calculateLanguageBreakdown(repos) {
  const breakdown = {};

  repos.forEach((repo) => {
    if (repo.language) {
      breakdown[repo.language] = (breakdown[repo.language] || 0) + 1;
    }
  });

  return breakdown;
}

function calculateTotalStars(repos) {
  return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
}

function calculateRepoStats(repos) {
  const original = repos.filter((repo) => !repo.fork).length;
  const forked = repos.filter((repo) => repo.fork).length;

  return {
    original,
    forked,
    total: repos.length,
  };
}

function getLastRepoUpdate(repos) {
  if (repos.length === 0) return null;

  return repos.reduce((latest, repo) => {
    return new Date(repo.updated_at) > new Date(latest.updated_at) ? repo : latest;
  }).updated_at;
}

function calculateDaysSinceLastActivity(lastUpdate) {
  if (!lastUpdate) return null;

  const lastDate = new Date(lastUpdate);
  const now = new Date();
  const diffTime = Math.abs(now - lastDate);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function calculateProfileCompleteness(profileData) {
  const fields = ['name', 'bio', 'location', 'blog', 'company', 'email'];
  let filledFields = 0;

  fields.forEach((field) => {
    if (profileData[field]) {
      filledFields++;
    }
  });

  return Math.round((filledFields / fields.length) * 100);
}

async function analyzeGitHubProfile(username) {
  const profile = await fetchUserProfile(username);
  const repos = await fetchUserRepositories(username);

  const topLanguages = calculateLanguageStats(repos);
  const topStarredRepos = calculateTopStarredRepos(repos);
  const languageBreakdown = calculateLanguageBreakdown(repos);
  const totalStars = calculateTotalStars(repos);
  const repoStats = calculateRepoStats(repos);
  const lastRepoUpdate = getLastRepoUpdate(repos);
  const daysSinceLastActivity = calculateDaysSinceLastActivity(lastRepoUpdate);
  const profileCompleteness = calculateProfileCompleteness(profile);

  return {
    username: profile.login,
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
    profile_url: profile.html_url,
    github_created_at: profile.created_at,
    github_updated_at: profile.updated_at,
    top_languages: topLanguages,
    total_stars: totalStars,
    forked_repos_count: repoStats.forked,
    original_repos_count: repoStats.original,
    top_starred_repos: topStarredRepos,
    language_breakdown: languageBreakdown,
    last_repo_update: lastRepoUpdate,
    days_since_last_activity: daysSinceLastActivity,
    profile_completeness_score: profileCompleteness,
  };
}

module.exports = {
  analyzeGitHubProfile,
  fetchUserProfile,
  fetchUserRepositories,
};
