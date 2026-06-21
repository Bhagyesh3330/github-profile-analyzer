-- GitHub Profile Analyzer Database Schema

CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  bio TEXT,
  location VARCHAR(255),
  blog VARCHAR(255),
  company VARCHAR(255),
  email VARCHAR(255),
  public_repos INT DEFAULT 0,
  public_gists INT DEFAULT 0,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  avatar_url VARCHAR(255),
  profile_url VARCHAR(255),
  github_created_at DATETIME,
  github_updated_at DATETIME,

  -- Top 5 languages as JSON array
  top_languages JSON,

  -- Repository insights
  total_stars INT DEFAULT 0,
  forked_repos_count INT DEFAULT 0,
  original_repos_count INT DEFAULT 0,

  -- Top 5 starred repos as JSON array
  top_starred_repos JSON,

  -- Repository language breakdown (JSON object)
  language_breakdown JSON,

  -- Activity and profile metrics
  last_repo_update DATETIME,
  days_since_last_activity INT,
  profile_completeness_score INT DEFAULT 0,

  -- Timestamps
  analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_username (username),
  INDEX idx_analyzed_at (analyzed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
