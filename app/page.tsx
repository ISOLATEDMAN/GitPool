import { GitCommit, GitPullRequest, Code, Zap, Trophy, Users, MessageSquare, Bug, Crown, Medal, Award, TrendingUp, Flame, Star, Target, Folder, Shield, Sword, Crosshair, Activity, ChevronUp, ChevronDown, Sparkles, Rocket, BarChart3, PieChart, ArrowUpRight, Clock, Hash, Github } from "lucide-react";
import { getDashboardData } from "./actions/get-dashboard-data";
import { TierBarChart } from "@/components/tier-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

// Top 3 Leaderboard Card
function LeaderCard({ user, rank }: { user: any, rank: number }) {
  if (!user) return null;
  
  const rankStyles: Record<number, { bg: string, border: string, badge: string, icon: any }> = {
    1: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-500", icon: Crown },
    2: { bg: "bg-slate-50", border: "border-slate-200", badge: "bg-slate-400", icon: Medal },
    3: { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-400", icon: Award },
  };
  
  const style = rankStyles[rank];
  const RankIcon = style.icon;

  return (
    <Card className={`${style.bg} ${style.border} border-2 relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
      {/* Rank Badge */}
      <div className={`absolute top-3 right-3 w-8 h-8 ${style.badge} rounded-full flex items-center justify-center shadow-md`}>
        <span className="text-white font-bold text-sm">{rank}</span>
      </div>
      
      <CardContent className="pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src={user.avatar || ""} />
              <AvatarFallback className="text-lg font-bold">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 p-1 ${style.badge} rounded-full`}>
              <RankIcon className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-neutral-900 truncate">{user.username}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">Tier {user.tier}</Badge>
              <span className="text-xs text-neutral-500">{user.projectCount} repos</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-black text-neutral-900">{Number(user.points).toLocaleString()}</div>
            <div className="text-xs text-neutral-500">points</div>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-neutral-200/50">
          <div className="text-center">
            <div className="text-sm font-bold text-neutral-900">{user.commits}</div>
            <div className="text-[10px] text-neutral-500">Commits</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-neutral-900">{user.prsMerged}</div>
            <div className="text-[10px] text-neutral-500">PRs</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-neutral-900">{user.reviews}</div>
            <div className="text-[10px] text-neutral-500">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-green-600">+{(Number(user.additions)/1000).toFixed(1)}k</div>
            <div className="text-[10px] text-neutral-500">Lines</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Leaderboard Table Row
function LeaderboardRow({ user, rank, maxPoints }: { user: any, rank: number, maxPoints: number }) {
  const pointsPct = (Number(user.points) / maxPoints) * 100;
  
  const tierColors: Record<string, string> = {
    S: "bg-amber-100 text-amber-700 border-amber-200",
    A: "bg-purple-100 text-purple-700 border-purple-200",
    B: "bg-blue-100 text-blue-700 border-blue-200",
    C: "bg-green-100 text-green-700 border-green-200",
    D: "bg-neutral-100 text-neutral-600 border-neutral-200",
  };

  return (
    <div className="group flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0">
      {/* Rank */}
      <div className="w-8 text-center">
        <span className={`font-bold text-lg ${rank <= 3 ? 'text-amber-500' : 'text-neutral-400'}`}>
          {rank}
        </span>
      </div>
      
      {/* User Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 border border-neutral-200">
          <AvatarImage src={user.avatar || ""} />
          <AvatarFallback className="text-sm">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="font-semibold text-neutral-900 truncate">{user.username}</div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${tierColors[user.tier] || tierColors.D}`}>
              {user.tier}
            </span>
            <span className="text-xs text-neutral-400">{user.projectCount} repos</span>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="text-center w-16">
          <div className="font-semibold text-neutral-700">{user.commits}</div>
          <div className="text-[10px] text-neutral-400">commits</div>
        </div>
        <div className="text-center w-16">
          <div className="font-semibold text-neutral-700">{user.prsMerged}</div>
          <div className="text-[10px] text-neutral-400">PRs</div>
        </div>
        <div className="text-center w-16">
          <div className="font-semibold text-neutral-700">{user.reviews}</div>
          <div className="text-[10px] text-neutral-400">reviews</div>
        </div>
      </div>
      
      {/* Points with Progress */}
      <div className="w-32 text-right">
        <div className="font-bold text-neutral-900">{Number(user.points).toLocaleString()}</div>
        <div className="h-1.5 w-full bg-neutral-100 rounded-full mt-1 overflow-hidden">
          <div 
            className="h-full bg-neutral-900 rounded-full transition-all duration-500" 
            style={{ width: `${pointsPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const { stats, leaderboard, recentActivity, tierChartData } = await getDashboardData();
  
  const top3 = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);
  const maxPoints = leaderboard.length > 0 ? Number(leaderboard[0].points) : 1;

  // Calculate additional stats
  const totalContributors = leaderboard.length;
  const avgPoints = totalContributors > 0 
    ? Math.round(leaderboard.reduce((sum, u) => sum + Number(u.points), 0) / totalContributors)
    : 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-neutral-900 tracking-tight">GitPool</h1>
                <p className="text-xs text-neutral-500">Developer Leaderboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/ISOLATEDMAN/GitPool" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <Badge variant="outline" className="gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Contributors</p>
                  <p className="text-3xl font-black text-neutral-900">{totalContributors}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Total Commits</p>
                  <p className="text-3xl font-black text-neutral-900">{stats?.totalCommits || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <GitCommit className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 font-medium">PRs Merged</p>
                  <p className="text-3xl font-black text-neutral-900">{stats?.totalPrs || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <GitPullRequest className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 font-medium">Lines Added</p>
                  <p className="text-3xl font-black text-neutral-900">
                    {stats?.linesCode ? (stats.linesCode / 1000).toFixed(1) + 'k' : '0'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-neutral-900">Top Contributors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LeaderCard user={top3[0]} rank={1} />
            <LeaderCard user={top3[1]} rank={2} />
            <LeaderCard user={top3[2]} rank={3} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Full Leaderboard */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      All Contributors
                    </CardTitle>
                    <CardDescription>Ranked by total points</CardDescription>
                  </div>
                  <Badge variant="secondary">{leaderboard.length} total</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {leaderboard.map((user, i) => (
                    <LeaderboardRow 
                      key={user.username} 
                      user={user} 
                      rank={i + 1}
                      maxPoints={maxPoints}
                    />
                  ))}
                  {leaderboard.length === 0 && (
                    <div className="p-12 text-center">
                      <Users className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
                      <p className="text-neutral-500">No contributors yet</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Tier Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Tier Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TierBarChart data={tierChartData} />
                <div className="grid grid-cols-5 gap-1 mt-4">
                  {tierChartData.map((tier) => (
                    <div key={tier.tier} className="text-center p-2 bg-neutral-50 rounded-lg">
                      <div className="text-xs font-black" style={{ color: tier.fill }}>{tier.tier}</div>
                      <div className="text-lg font-bold text-neutral-900">{tier.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[320px]">
                  <div className="p-4 space-y-3">
                    {recentActivity.map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start gap-3">
                          <Avatar className="w-8 h-8 border border-neutral-200 shrink-0">
                            <AvatarImage src={activity.avatar || ""} />
                            <AvatarFallback className="text-xs">{activity.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-semibold">{activity.user}</span>
                              <span className="text-neutral-500 mx-1">earned</span>
                              <span className="font-semibold text-green-600">+{activity.points}</span>
                            </p>
                            <p className="text-xs text-neutral-500 truncate">{activity.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Icon className="w-3 h-3 text-neutral-400" />
                              <span className="text-[10px] text-neutral-400">{timeAgo(activity.createdAt)}</span>
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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                    <span className="text-sm text-neutral-500">Avg Points</span>
                    <span className="font-bold">{avgPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                    <span className="text-sm text-neutral-500">Top Score</span>
                    <span className="font-bold">{maxPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                    <span className="text-sm text-neutral-500">Code Reviews</span>
                    <span className="font-bold">{stats?.totalReviews || 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-neutral-500">Issues Closed</span>
                    <span className="font-bold">{stats?.totalIssuesClosed || 0}</span>
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
