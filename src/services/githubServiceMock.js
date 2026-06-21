function getMockProfile(username) {
  const mockData = {
    torvalds: {
      username: 'torvalds',
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
      profile_url: 'https://github.com/torvalds',
      github_created_at: '2005-04-16T22:38:05Z',
      github_updated_at: '2024-06-21T10:00:00Z',
      top_languages: ['C', 'Shell'],
      total_stars: 150000,
      forked_repos_count: 0,
      original_repos_count: 2,
      top_starred_repos: [
        {
          name: 'linux',
          stars: 150000,
          url: 'https://github.com/torvalds/linux',
          description: 'The Linux kernel repository',
        },
      ],
      language_breakdown: { C: 1, Shell: 1 },
      last_repo_update: '2024-06-21T10:00:00Z',
      days_since_last_activity: 0,
      profile_completeness_score: 85,
    },
    octocat: {
      username: 'octocat',
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
      profile_url: 'https://github.com/octocat',
      github_created_at: '2011-01-25T19:06:43Z',
      github_updated_at: '2024-06-21T10:00:00Z',
      top_languages: ['JavaScript', 'Ruby'],
      total_stars: 1200,
      forked_repos_count: 2,
      original_repos_count: 8,
      top_starred_repos: [
        {
          name: 'Hello-World',
          stars: 1200,
          url: 'https://github.com/octocat/Hello-World',
          description: 'Sample repository',
        },
      ],
      language_breakdown: { JavaScript: 3, Ruby: 2, Python: 1 },
      last_repo_update: '2024-06-21T10:00:00Z',
      days_since_last_activity: 0,
      profile_completeness_score: 90,
    },
  };

  return mockData[username] || null;
}

async function analyzeGitHubProfile(username) {
  const profile = getMockProfile(username);
  if (!profile) {
    throw new Error(`GitHub user "${username}" not found`);
  }
  return profile;
}

module.exports = {
  analyzeGitHubProfile,
};
