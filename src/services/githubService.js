const axios = require('axios');
require('dotenv').config();

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const mockProfiles = {
  torvalds: {
    login: 'torvalds',
    name: 'Linus Torvalds',
    bio: 'Linux creator',
    location: 'Portland, OR',
    blog: 'https://torvalds-family.blogspot.com',
    company: 'Linux Foundation',
    email: null,
    public_repos: 2,
    public_gists: 0,
    followers: 189000,
    following: 0,
    avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    html_url: 'https://github.com/torvalds',
    created_at: '2005-04-16T22:38:05Z',
    updated_at: '2024-06-21T10:00:00Z',
  },
  octocat: {
    login: 'octocat',
    name: 'The Octocat',
    bio: "GitHub's mascot",
    location: 'San Francisco',
    blog: 'https://github.blog',
    company: 'GitHub',
    email: null,
    public_repos: 2,
    public_gists: 1,
    followers: 3938,
    following: 9,
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    html_url: 'https://github.com/octocat',
    created_at: '2011-01-25T19:06:43Z',
    updated_at: '2024-06-21T10:00:00Z',
  },
};

const mockRepos = {
  torvalds: [
    {
      name: 'linux',
      language: 'C',
      stargazers_count: 150000,
      html_url: 'https://github.com/torvalds/linux',
      description: 'The Linux kernel repository',
      updated_at: '2024-06-21T10:00:00Z',
      fork: false,
    },
    {
      name: 'subsurface-for-dirk',
      language: 'C',
      stargazers_count: 100,
      html_url: 'https://github.com/torvalds/subsurface-for-dirk',
      description: 'Diving log software',
      updated_at: '2024-06-21T09:00:00Z',
      fork: false,
    },
  ],
  octocat: [
    {
      name: 'Hello-World',
      language: 'JavaScript',
      stargazers_count: 1200,
      html_url: 'https://github.com/octocat/Hello-World',
      description: 'Sample repository',
      updated_at: '2024-06-21T10:00:00Z',
      fork: false,
    },
    {
      name: 'Spoon-Knife',
      language: 'HTML',
      stargazers_count: 8000,
      html_url: 'https://github.com/octocat/Spoon-Knife',
      description: 'Test repository',
      updated_at: '2024-06-21T08:00:00Z',
      fork: true,
    },
  ],
};

const githubClient = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

async function fetchUserProfile(username) {
  if (process.env.USE_MOCK_DB === 'true') {
    const profile = mockProfiles[username];
    if (!profile) {
      throw new Error(`GitHub user "${username}" not found`);
    }
    return profile;
  }

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
  if (process.env.USE_MOCK_DB === 'true') {
    return mockRepos[username] || [];
  }

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

