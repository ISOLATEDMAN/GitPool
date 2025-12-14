"use server";
import { db } from "@/db";
import { activities, users, repositories } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

// Tier config
const TIER_CONFIG = {
  S: { color: 'text-yellow-500', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50' },
  A: { color: 'text-purple-500', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/50' },
  B: { color: 'text-blue-500', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50' },
  C: { color: 'text-green-500', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50' },
  D: { color: 'text-neutral-500', bgColor: 'bg-neutral-500/20', borderColor: 'border-neutral-500/50' },
};

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

  // 2. Extended Leaderboard (All Contributors with detailed stats)
  const leaderboard = await db.select({
      username: users.username,
      avatar: users.avatarUrl,
      points: sql<number>`sum(${activities.points})`,
      projectCount: sql<number>`count(distinct ${activities.repositoryId})`,
      commits: sql<number>`sum(case when ${activities.type} = 'PUSH' then 1 else 0 end)`,
      prsMerged: sql<number>`sum(case when ${activities.type} = 'PR_MERGED' then 1 else 0 end)`,
      prsOpened: sql<number>`sum(case when ${activities.type} = 'PR_OPENED' then 1 else 0 end)`,
      reviews: sql<number>`sum(case when ${activities.type} = 'CODE_REVIEW' then 1 else 0 end)`,
      issuesClosed: sql<number>`sum(case when ${activities.type} = 'ISSUE_CLOSED' then 1 else 0 end)`,
      additions: sql<number>`sum(${activities.additions})`,
      deletions: sql<number>`sum(${activities.deletions})`,
    })
    .from(activities)
    .innerJoin(users, eq(activities.userId, users.id))
    .groupBy(users.id, users.username, users.avatarUrl)
    .orderBy(desc(sql`sum(${activities.points})`));

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

  // 4. Assign tiers based on score relative to max score
  const maxScore = leaderboard.length > 0 ? Number(leaderboard[0].points) : 0;
  
  const leaderboardWithTiers = leaderboard.map((user, index) => ({
    ...user,
    rank: index + 1,
    ...assignTierByScore(Number(user.points), maxScore)
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

  return { 
    stats: stats[0], 
    leaderboard: leaderboardWithTiers,
    recentActivity,
    tierChartData,
  };
}