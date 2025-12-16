"use server";
import { db } from "@/db";
import { activities, users, repositories } from "@/db/schema";
import { desc, eq, sql, gte } from "drizzle-orm";

// Tier config
const TIER_CONFIG = {
  S: { color: 'text-yellow-500', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50' },
  A: { color: 'text-purple-500', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/50' },
  B: { color: 'text-blue-500', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50' },
  C: { color: 'text-green-500', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50' },
  D: { color: 'text-neutral-500', bgColor: 'bg-neutral-500/20', borderColor: 'border-neutral-500/50' },
};

// Badge definitions
const BADGES = {
  FIRST_COMMIT: { id: 'first_commit', name: 'First Blood', icon: '🎯', description: 'Made your first commit' },
  COMMIT_10: { id: 'commit_10', name: 'Committed', icon: '💪', description: '10+ commits' },
  COMMIT_50: { id: 'commit_50', name: 'Code Machine', icon: '🔥', description: '50+ commits' },
  COMMIT_100: { id: 'commit_100', name: 'Centurion', icon: '💯', description: '100+ commits' },
  PR_MASTER: { id: 'pr_master', name: 'PR Master', icon: '🎖️', description: '10+ PRs merged' },
  REVIEWER: { id: 'reviewer', name: 'Code Reviewer', icon: '👀', description: '5+ code reviews' },
  BUG_HUNTER: { id: 'bug_hunter', name: 'Bug Hunter', icon: '🐛', description: '5+ issues closed' },
  EARLY_BIRD: { id: 'early_bird', name: 'Early Bird', icon: '🐦', description: 'First contributor' },
  TOP_CONTRIBUTOR: { id: 'top_contributor', name: 'Top Contributor', icon: '👑', description: '#1 on leaderboard' },
  CONSISTENT: { id: 'consistent', name: 'Consistent', icon: '📅', description: 'Active 7+ days' },
};

// Calculate badges for a user
function calculateBadges(user: any, rank: number): typeof BADGES[keyof typeof BADGES][] {
  const badges: typeof BADGES[keyof typeof BADGES][] = [];
  
  const commits = Number(user.commits) || 0;
  const prs = Number(user.prsMerged) || 0;
  const reviews = Number(user.reviews) || 0;
  const issues = Number(user.issuesClosed) || 0;
  
  if (commits >= 1) badges.push(BADGES.FIRST_COMMIT);
  if (commits >= 10) badges.push(BADGES.COMMIT_10);
  if (commits >= 50) badges.push(BADGES.COMMIT_50);
  if (commits >= 100) badges.push(BADGES.COMMIT_100);
  if (prs >= 10) badges.push(BADGES.PR_MASTER);
  if (reviews >= 5) badges.push(BADGES.REVIEWER);
  if (issues >= 5) badges.push(BADGES.BUG_HUNTER);
  if (rank === 1 && Number(user.points) > 0) badges.push(BADGES.TOP_CONTRIBUTOR);
  
  return badges;
}

// Calculate tier based on score relative to the top performer
function assignTierByScore(score: number, maxScore: number): { tier: string; color: string; bgColor: string; borderColor: string } {
  if (maxScore === 0) return { tier: 'D', ...TIER_CONFIG.D };
  
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) return { tier: 'S', ...TIER_CONFIG.S }; // Elite (90-100% of leader)
  if (percentage >= 70) return { tier: 'A', ...TIER_CONFIG.A }; // High Performer (70-89%)
  if (percentage >= 50) return { tier: 'B', ...TIER_CONFIG.B }; // Above Average (50-69%)
  if (percentage >= 25) return { tier: 'C', ...TIER_CONFIG.C }; // Average (25-49%)
  return { tier: 'D', ...TIER_CONFIG.D }; // Needs Improvement (<25%)
}

export async function getDashboardData() {
  // 1. KPI Stats
  const stats = await db.select({
      totalCommits: sql<number>`sum(case when ${activities.type} = 'PUSH' then 1 else 0 end)`,
      totalPrs: sql<number>`sum(case when ${activities.type} = 'PR_MERGED' then 1 else 0 end)`,
      linesCode: sql<number>`sum(${activities.additions})`,
      totalReviews: sql<number>`sum(case when ${activities.type} = 'CODE_REVIEW' then 1 else 0 end)`,
      totalIssuesClosed: sql<number>`sum(case when ${activities.type} = 'ISSUE_CLOSED' then 1 else 0 end)`,
    }).from(activities);

  // 2. Get ALL active users with their stats (LEFT JOIN to include users with 0 activity)
  const leaderboard = await db.select({
      username: users.username,
      avatar: users.avatarUrl,
      isActive: users.isActive,
      points: sql<number>`coalesce(sum(${activities.points}), 0)`,
      projectCount: sql<number>`count(distinct ${activities.repositoryId})`,
      commits: sql<number>`coalesce(sum(case when ${activities.type} = 'PUSH' then 1 else 0 end), 0)`,
      prsMerged: sql<number>`coalesce(sum(case when ${activities.type} = 'PR_MERGED' then 1 else 0 end), 0)`,
      prsOpened: sql<number>`coalesce(sum(case when ${activities.type} = 'PR_OPENED' then 1 else 0 end), 0)`,
      reviews: sql<number>`coalesce(sum(case when ${activities.type} = 'CODE_REVIEW' then 1 else 0 end), 0)`,
      issuesClosed: sql<number>`coalesce(sum(case when ${activities.type} = 'ISSUE_CLOSED' then 1 else 0 end), 0)`,
      additions: sql<number>`coalesce(sum(${activities.additions}), 0)`,
      deletions: sql<number>`coalesce(sum(${activities.deletions}), 0)`,
    })
    .from(users)
    .leftJoin(activities, eq(activities.userId, users.id))
    .where(eq(users.isActive, true))
    .groupBy(users.id, users.username, users.avatarUrl, users.isActive)
    .orderBy(desc(sql`coalesce(sum(${activities.points}), 0)`));

  // 3. Recent Activity Feed
  const recentActivity = await db.select({
      id: activities.id,
      user: users.username,
      avatar: users.avatarUrl,
      project: repositories.name,
      type: activities.type,
      title: activities.title,
      points: activities.points,
      additions: activities.additions,
      deletions: activities.deletions,
      createdAt: activities.createdAt
    })
    .from(activities)
    .innerJoin(users, eq(activities.userId, users.id))
    .innerJoin(repositories, eq(activities.repositoryId, repositories.id))
    .orderBy(desc(activities.createdAt))
    .limit(15);

  // 4. Assign tiers and badges based on score relative to max score
  const maxScore = leaderboard.length > 0 ? Number(leaderboard[0].points) : 0;
  
  const leaderboardWithTiers = leaderboard.map((user, index) => ({
    ...user,
    rank: index + 1,
    ...assignTierByScore(Number(user.points), maxScore),
    badges: calculateBadges(user, index + 1)
  }));

  // Calculate tier distribution for chart
  const tierDistribution = leaderboardWithTiers.reduce((acc, user) => {
    acc[user.tier] = (acc[user.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tierChartData = [
    { tier: 'S', count: tierDistribution['S'] || 0, fill: '#eab308' },
    { tier: 'A', count: tierDistribution['A'] || 0, fill: '#a855f7' },
    { tier: 'B', count: tierDistribution['B'] || 0, fill: '#3b82f6' },
    { tier: 'C', count: tierDistribution['C'] || 0, fill: '#22c55e' },
    { tier: 'D', count: tierDistribution['D'] || 0, fill: '#737373' },
  ];

  // 5. Contribution heatmap data (last 4 months)
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
  fourMonthsAgo.setDate(1); // Start of that month
  
  const contributionData = await db.select({
      date: sql<string>`DATE(${activities.createdAt})`,
      count: sql<number>`count(*)`,
    })
    .from(activities)
    .where(gte(activities.createdAt, fourMonthsAgo))
    .groupBy(sql`DATE(${activities.createdAt})`)
    .orderBy(sql`DATE(${activities.createdAt})`);

  // 6. Project breakdown (contributions by repo)
  const projectBreakdown = await db.select({
      name: repositories.name,
      commits: sql<number>`sum(case when ${activities.type} = 'PUSH' then 1 else 0 end)`,
      prs: sql<number>`sum(case when ${activities.type} = 'PR_MERGED' then 1 else 0 end)`,
      reviews: sql<number>`sum(case when ${activities.type} = 'CODE_REVIEW' then 1 else 0 end)`,
      issues: sql<number>`sum(case when ${activities.type} = 'ISSUE_CLOSED' then 1 else 0 end)`,
      total: sql<number>`count(*)`,
    })
    .from(activities)
    .innerJoin(repositories, eq(activities.repositoryId, repositories.id))
    .groupBy(repositories.id, repositories.name)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // Transform contribution data to heatmap format
  const heatmapData = contributionData.map(d => ({
    date: d.date,
    count: Number(d.count)
  }));

  // Transform project data for pie chart
  const projectChartData = projectBreakdown.map((p, i) => ({
    name: p.name,
    commits: Number(p.commits),
    prs: Number(p.prs),
    reviews: Number(p.reviews),
    issues: Number(p.issues),
    total: Number(p.total),
  }));

  return { 
    stats: stats[0], 
    leaderboard: leaderboardWithTiers,
    recentActivity,
    tierChartData,
    heatmapData,
    projectChartData,
  };
}