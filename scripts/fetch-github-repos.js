import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = 'akshitaa011';
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/github-repos.json');

// Excluded repo names: existing portfolio projects, profile repos, config repos
const EXCLUDED_NAMES = new Set([
  'envguard',
  'dsaverse',
  'intellichat-ai',
  'intellichat',
  'akshitaa011',
  'akshitaa011.github.io',
  'ner-model',
  'radar-x'
]);

async function fetchReadmeSummary(repoName) {
  for (const branch of ['main', 'master']) {
    try {
      const url = `https://raw.githubusercontent.com/${USERNAME}/${repoName}/${branch}/README.md`;
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const lines = text.split('\n');
        for (const line of lines) {
          const cleaned = line.replace(/^[#\s*-]+/, '').trim();
          if (cleaned && cleaned.length > 5 && !cleaned.toLowerCase().startsWith('http')) {
            return cleaned.substring(0, 140);
          }
        }
      }
    } catch (e) {}
  }
  return null;
}

export async function syncGitHubRepos() {
  console.log(`[GitHub Sync] Fetching public repositories for @${USERNAME}...`);
  try {
    const headers = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
    const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { headers });
    if (!res.ok) {
      console.warn(`[GitHub Sync] GitHub API responded with status ${res.status}. Keeping existing cache if present.`);
      return;
    }

    const repos = await res.json();
    if (!Array.isArray(repos)) {
      console.warn(`[GitHub Sync] Unexpected API response. Keeping existing cache.`);
      return;
    }

    const filtered = [];

    for (const repo of repos) {
      // Exclude forks, archived, profile/config repos, and existing featured projects
      if (repo.fork) continue;
      if (repo.archived) continue;
      if (EXCLUDED_NAMES.has(repo.name.toLowerCase())) continue;

      let description = repo.description?.trim() || null;
      let isDescriptionFromReadme = false;

      if (!description) {
        const readmeLine = await fetchReadmeSummary(repo.name);
        if (readmeLine) {
          description = readmeLine;
          isDescriptionFromReadme = true;
        } else {
          description = `${repo.name} engineering repository by @${USERNAME}`;
        }
      }

      const isResumeIQ = repo.name.toLowerCase() === 'resumeiq';
      filtered.push({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: isResumeIQ 
          ? "Interactive resume analysis & engineering tool built with JavaScript and HTML" 
          : description,
        isDescriptionFromReadme,
        language: isResumeIQ ? 'JavaScript' : (repo.language || 'Code'),
        languages: isResumeIQ ? ['JavaScript', 'HTML'] : (repo.language ? [repo.language] : []),
        topics: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        htmlUrl: repo.html_url,
        homepage: repo.homepage ? repo.homepage.trim() : null
      });
    }

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(filtered, null, 2), 'utf8');
    console.log(`[GitHub Sync] Successfully saved ${filtered.length} additional repositories to ${OUTPUT_FILE}`);
    return filtered;
  } catch (error) {
    console.warn(`[GitHub Sync] Network error fetching repos:`, error.message);
  }
}

// Execute directly if run via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncGitHubRepos().then(res => {
    if (res) {
      console.log('Repositories synced:', res.map(r => ({ name: r.name, language: r.language, desc: r.description })));
    }
  });
}
