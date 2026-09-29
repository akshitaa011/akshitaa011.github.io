/**
 * Telemetry & External API Client
 * - Fetches GitHub public activity for @akshitaa011
 * - Fetches/caches LeetCode profile metrics for @akshita1111
 * - Caches in sessionStorage with 15-minute TTL to respect API limits
 * - Fallbacks reliably to verified production dataset
 */

const GITHUB_USERNAME = 'akshitaa011';
const LEETCODE_USERNAME = 'akshita1111';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export const BUILD_DATE = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : 'Recent';

export const STATIC_GITHUB_ACTIVITIES = [
  { prefix: "git commit", text: "feat(submitty): clamp progress values overflow (PR #12567 merged to prod)", tag: "Submitty / RPI", date: "2026-03-29" },
  { prefix: "git commit", text: "refactor(forum): TAB/ESC keyboard event delegation (PR #12549 merged)", tag: "Open Source", date: "2026-03-27" },
  { prefix: "npx envguard", text: "scan --strict : 142 AST files parsed, 0 dead env vars", tag: "EnvGuard CLI", date: "2026-03-25" },
  { prefix: "leetcode", text: "solve: 450+ curated DSA challenges across Trees, Graphs, DP", tag: "DSAverse", date: "2026-03-22" },
  { prefix: "google-big-code", text: "verified: Top 1,500 nationwide algorithmic semi-finalist", tag: "Competition", date: "2026-03-18" },
];

export async function fetchGitHubActivities() {
  if (typeof window === 'undefined') return STATIC_GITHUB_ACTIVITIES;

  try {
    const cached = sessionStorage.getItem('akshita_github_events');
    const cachedTime = sessionStorage.getItem('akshita_github_events_time');

    if (cached && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_TTL_MS)) {
      return JSON.parse(cached);
    }

    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=15`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events = await response.json();
    const parsedActivities = [];

    for (const evt of events) {
      if (evt.type === 'PushEvent' && evt.payload?.commits?.length > 0) {
        for (const commit of evt.payload.commits.slice(0, 2)) {
          parsedActivities.push({
            prefix: "git commit",
            text: commit.message.split('\n')[0],
            tag: evt.repo?.name ? evt.repo.name.replace(`${GITHUB_USERNAME}/`, '') : 'GitHub',
            date: evt.created_at?.split('T')[0] || ''
          });
        }
      } else if (evt.type === 'PullRequestEvent') {
        const pr = evt.payload?.pull_request;
        if (pr) {
          parsedActivities.push({
            prefix: "git pr",
            text: `${pr.title} (#${pr.number})`,
            tag: evt.repo?.name?.split('/')[1] || 'Open Source',
            date: evt.created_at?.split('T')[0] || ''
          });
        }
      }
    }

    if (parsedActivities.length > 0) {
      // Merge with static fallbacks so we always have a rich stream
      const merged = [...parsedActivities, ...STATIC_GITHUB_ACTIVITIES].slice(0, 8);
      sessionStorage.setItem('akshita_github_events', JSON.stringify(merged));
      sessionStorage.setItem('akshita_github_events_time', Date.now().toString());
      return merged;
    }
  } catch (err) {
    // Graceful fallback to static verified dataset
  }

  return STATIC_GITHUB_ACTIVITIES;
}

export async function fetchLeetCodeStats() {
  const fallback = {
    totalSolved: 450,
    easySolved: 165,
    mediumSolved: 235,
    hardSolved: 50,
    ranking: "Curated",
    acceptanceRate: "64.2%"
  };

  if (typeof window === 'undefined') return fallback;

  try {
    const cached = sessionStorage.getItem('akshita_leetcode_stats');
    const cachedTime = sessionStorage.getItem('akshita_leetcode_stats_time');

    if (cached && cachedTime && (Date.now() - parseInt(cachedTime, 10) < CACHE_TTL_MS)) {
      return JSON.parse(cached);
    }

    // Try public proxy
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success' && data.totalSolved) {
        const stats = {
          totalSolved: data.totalSolved,
          easySolved: data.easySolved,
          mediumSolved: data.mediumSolved,
          hardSolved: data.hardSolved,
          ranking: data.ranking ? `#${data.ranking}` : fallback.ranking,
          acceptanceRate: `${data.acceptanceRate || 64.2}%`
        };
        sessionStorage.setItem('akshita_leetcode_stats', JSON.stringify(stats));
        sessionStorage.setItem('akshita_leetcode_stats_time', Date.now().toString());
        return stats;
      }
    }
  } catch (e) {
    // Network or CORS issue; proceed with fallback
  }

  return fallback;
}
