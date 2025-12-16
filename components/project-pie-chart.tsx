"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ProjectData {
  name: string;
  commits: number;
  prs: number;
  reviews: number;
  issues: number;
  total: number;
}

interface ProjectPieChartProps {
  data: ProjectData[];
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

export function ProjectPieChart({ data }: ProjectPieChartProps) {
  const chartData = data.slice(0, 8).map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  const totalActivity = data.reduce((sum, d) => sum + d.total, 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ProjectData }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-neutral-900 dark:text-white mb-2">{item.name}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500 dark:text-neutral-400">Commits:</span>
              <span className="font-medium text-neutral-900 dark:text-white">{item.commits}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500 dark:text-neutral-400">PRs:</span>
              <span className="font-medium text-neutral-900 dark:text-white">{item.prs}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500 dark:text-neutral-400">Reviews:</span>
              <span className="font-medium text-neutral-900 dark:text-white">{item.reviews}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500 dark:text-neutral-400">Issues:</span>
              <span className="font-medium text-neutral-900 dark:text-white">{item.issues}</span>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-1 mt-1 flex justify-between gap-4">
              <span className="text-neutral-500 dark:text-neutral-400">Total:</span>
              <span className="font-bold text-neutral-900 dark:text-white">{item.total}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-neutral-400 dark:text-neutral-500">
        No project data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="total"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-neutral-600 dark:text-neutral-300 truncate" title={item.name}>
              {item.name}
            </span>
            <span className="text-neutral-400 dark:text-neutral-500 ml-auto">
              {((item.total / totalActivity) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
