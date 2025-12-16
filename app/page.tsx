import { GitCommit, GitPullRequest, Code, Zap, Trophy, Users, MessageSquare, Bug, Crown, Medal, Award, TrendingUp, Flame, Star, Target, Folder, Shield, Sword, Crosshair, Activity, ChevronUp, ChevronDown, Sparkles, Rocket, BarChart3, PieChart, ArrowUpRight, Clock, Hash, Github, CheckCircle2, Calendar } from "lucide-react";
import { getDashboardData } from "./actions/get-dashboard-data";
import { TierBarChart } from "@/components/tier-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContributionHeatmap } from "@/components/contribution-heatmap";
import { ProjectPieChart } from "@/components/project-pie-chart";
import { BadgeDisplay } from "@/components/badge-display";
import { Header } from "@/components/header";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = "force-dynamic";
// Helper for relative time
function timeAgo(date: Date | null) {
  if (!date) return "";
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'PUSH': return GitCommit;
    case 'PR_MERGED': return GitPullRequest;
    case 'PR_OPENED': return GitPullRequest;
    case 'CODE_REVIEW': return MessageSquare;
    case 'ISSUE_CLOSED': return Bug;
    default: return Zap;
  }
}

// Top 3 Podium Section - Clean Modern Design
function TopPerformersPodium({ users }: { users: any[] }) {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
        <p className="text-neutral-500 dark:text-neutral-400">No top performers yet</p>
      </div>
    );
  }
  
  const [first, second, third] = users;
  
  return (
    <div className="flex flex-col items-center">
      {/* Main Podium Container */}
      <div className="w-full max-w-4xl">
        
        {/* 1st Place - Hero Section */}
        {first && (
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 rounded-3xl p-8 border border-amber-200 dark:border-amber-800 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Left - Avatar & Badge */}
                <div className="relative">
                  <div className="absolute -inset-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full opacity-20 blur-xl animate-pulse" />
                  <div className="relative">
                    <Avatar className="h-28 w-28 border-4 border-white dark:border-neutral-800 shadow-2xl">
                      <AvatarImage src={first.avatar || ""} />
                      <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900">
                        {first.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg rotate-12">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Center - Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">#1</span>
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0">
                      Champion
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white">{first.username}</h3>
                  <div className="flex items-baseline justify-center md:justify-start gap-1 mt-1">
                    <span className="text-4xl font-black bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                      {Number(first.points).toLocaleString()}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">points</span>
                  </div>
                  {/* Badges */}
                  {first.badges && first.badges.length > 0 && (
                    <div className="mt-3">
                      <BadgeDisplay badges={first.badges} size="md" maxVisible={6} />
                    </div>
                  )}
                </div>
                
                {/* Right - Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm flex items-center justify-center mb-2">
                      <GitCommit className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-xl font-bold text-neutral-900 dark:text-white">{first.commits}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">commits</div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm flex items-center justify-center mb-2">
                      <GitPullRequest className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="text-xl font-bold text-neutral-900 dark:text-white">{first.prsMerged}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">PRs</div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="text-xl font-bold text-neutral-900 dark:text-white">{first.issuesClosed}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">issues</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 2nd & 3rd Place - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 2nd Place */}
          {second && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-slate-200 dark:border-slate-700">
                    <AvatarImage src={second.avatar || ""} />
                    <AvatarFallback className="font-bold bg-slate-100 dark:bg-slate-800">{second.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-slate-400 to-gray-500 rounded-lg flex items-center justify-center shadow">
                    <span className="text-white font-bold text-xs">2</span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Medal className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Runner Up</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 dark:text-white truncate">{second.username}</h3>
                  <div className="text-2xl font-black text-slate-600 dark:text-slate-300">{Number(second.points).toLocaleString()}</div>
                  {second.badges && second.badges.length > 0 && (
                    <div className="mt-2">
                      <BadgeDisplay badges={second.badges} size="sm" maxVisible={4} />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300">{second.commits}</div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500">commits</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300">{second.prsMerged}</div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500">PRs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300">{second.issuesClosed}</div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500">issues</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 3rd Place */}
          {third && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-orange-200 dark:border-orange-800">
                    <AvatarImage src={third.avatar || ""} />
                    <AvatarFallback className="font-bold bg-orange-50 dark:bg-orange-900">{third.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center shadow">
                    <span className="text-white font-bold text-xs">3</span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-medium text-orange-500 dark:text-orange-400">3rd Place</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 dark:text-white truncate">{third.username}</h3>
                  <div className="text-2xl font-black text-orange-600 dark:text-orange-400">{Number(third.points).toLocaleString()}</div>
                  {third.badges && third.badges.length > 0 && (
                    <div className="mt-2">
                      <BadgeDisplay badges={third.badges} size="sm" maxVisible={4} />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300">{third.commits}</div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500">commits</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300">{third.prsMerged}</div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500">PRs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neutral-700 dark:text-neutral-300">{third.issuesClosed}</div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500">issues</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Team member row for the rest of the team
function TeamMemberRow({ user, rank }: { user: any, rank: number }) {
  const tierColors: Record<string, string> = {
    S: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    A: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    B: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    C: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    D: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700",
  };

  return (
    <div className="group flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      {/* Rank */}
      <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <span className="font-bold text-sm text-neutral-500 dark:text-neutral-400">{rank}</span>
      </div>
      
      {/* User Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 border-2 border-white dark:border-neutral-800 shadow-sm">
          <AvatarImage src={user.avatar || ""} />
          <AvatarFallback className="text-sm font-semibold dark:bg-neutral-700">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 dark:text-white truncate">{user.username}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${tierColors[user.tier] || tierColors.D}`}>
              Tier {user.tier}
            </span>
          </div>
          {/* Badges */}
          {user.badges && user.badges.length > 0 && (
            <div className="mt-1">
              <BadgeDisplay badges={user.badges} size="sm" maxVisible={4} />
            </div>
          )}
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <GitCommit className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{user.commits}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
          <GitPullRequest className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">{user.prsMerged}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
          <span className="text-sm font-semibold text-green-700 dark:text-green-300">{user.issuesClosed}</span>
        </div>
      </div>
      
      {/* Points */}
      <div className="text-right min-w-[80px]">
        <div className="font-bold text-neutral-900 dark:text-white">{Number(user.points).toLocaleString()}</div>
        <div className="text-[10px] text-neutral-400 dark:text-neutral-500">points</div>
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const { stats, leaderboard, recentActivity, tierChartData, heatmapData, projectChartData } = await getDashboardData();
  
  const top3 = leaderboard.slice(0, 3);
  const maxPoints = leaderboard.length > 0 ? Number(leaderboard[0].points) : 1;

  // Calculate additional stats
  const totalContributors = leaderboard.length;
  const avgPoints = totalContributors > 0 
    ? Math.round(leaderboard.reduce((sum, u) => sum + Number(u.points), 0) / totalContributors)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Active Members</p>
                  <p className="text-3xl font-black text-neutral-900 dark:text-white">{totalContributors}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Total Commits</p>
                  <p className="text-3xl font-black text-neutral-900 dark:text-white">{stats?.totalCommits || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <GitCommit className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">PRs Merged</p>
                  <p className="text-3xl font-black text-neutral-900 dark:text-white">{stats?.totalPrs || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <GitPullRequest className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Issues Closed</p>
                  <p className="text-3xl font-black text-neutral-900 dark:text-white">{stats?.totalIssuesClosed || 0}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Podium Section */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-600 to-transparent" />
            <div className="flex items-center gap-2 px-4">
              <Trophy className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white">Top Performers</h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-600 to-transparent" />
          </div>
          
          {/* Podium Component */}
          <TopPerformersPodium users={top3} />
        </div>

        {/* Contribution Heatmap Section */}
        <div className="mb-8">
          <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                Team Activity
              </CardTitle>
              <CardDescription className="dark:text-neutral-400">Contribution activity over the last 16 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ContributionHeatmap data={heatmapData} />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members List */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Users className="w-5 h-5" />
                      Team Members
                    </CardTitle>
                    <CardDescription className="dark:text-neutral-400">Active contributors ranked by points</CardDescription>
                  </div>
                  <Badge variant="secondary" className="dark:bg-neutral-800 dark:text-neutral-300">{leaderboard.length} members</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {leaderboard.length > 0 ? (
                  <ScrollArea className="h-[450px]">
                    {leaderboard.map((user, i) => (
                      <TeamMemberRow 
                        key={user.username} 
                        user={user} 
                        rank={i + 1}
                      />
                    ))}
                  </ScrollArea>
                ) : (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
                    <p className="text-neutral-500 dark:text-neutral-400">No team members yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Project Breakdown */}
            <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 dark:text-white">
                  <PieChart className="w-4 h-4 text-blue-500" />
                  Most Active Repos
                </CardTitle>
                <CardDescription className="dark:text-neutral-400">Contributions by project</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectPieChart data={projectChartData} />
              </CardContent>
            </Card>

            {/* Tier Distribution */}
            <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 dark:text-white">
                  <BarChart3 className="w-4 h-4" />
                  Tier Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TierBarChart data={tierChartData} />
                <div className="grid grid-cols-5 gap-1 mt-4">
                  {tierChartData.map((tier) => (
                    <div key={tier.tier} className="text-center p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <div className="text-xs font-black" style={{ color: tier.fill }}>{tier.tier}</div>
                      <div className="text-lg font-bold text-neutral-900 dark:text-white">{tier.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 dark:text-white">
                  <Activity className="w-4 h-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[280px]">
                  <div className="p-4 space-y-3">
                    {recentActivity.map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start gap-3">
                          <Avatar className="w-8 h-8 border border-neutral-200 dark:border-neutral-700 shrink-0">
                            <AvatarImage src={activity.avatar || ""} />
                            <AvatarFallback className="text-xs dark:bg-neutral-800">{activity.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-semibold dark:text-white">{activity.user}</span>
                              <span className="text-neutral-500 dark:text-neutral-400 mx-1">earned</span>
                              <span className="font-semibold text-green-600 dark:text-green-400">+{activity.points}</span>
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{activity.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Icon className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{timeAgo(activity.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-200 dark:border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 dark:text-white">
                  <TrendingUp className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Avg Points</span>
                    <span className="font-bold dark:text-white">{avgPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Top Score</span>
                    <span className="font-bold dark:text-white">{maxPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Code Reviews</span>
                    <span className="font-bold dark:text-white">{stats?.totalReviews || 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Lines Added</span>
                    <span className="font-bold text-green-600 dark:text-green-400">+{stats?.linesCode ? (stats.linesCode / 1000).toFixed(1) + 'k' : '0'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
