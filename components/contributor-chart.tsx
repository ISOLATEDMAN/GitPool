"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ContributorData {
  username: string;
  commits: number;
  prsMerged: number;
  reviews: number;
}

interface ContributorChartProps {
  data: ContributorData[];
}

export function ContributorChart({ data }: ContributorChartProps) {
  // Take top 8 for better visualization
  const chartData = data.slice(0, 8).map(d => ({
    name: d.username.length > 10 ? d.username.slice(0, 10) + '...' : d.username,
    commits: Number(d.commits) || 0,
    prs: Number(d.prsMerged) || 0,
    reviews: Number(d.reviews) || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} barGap={2}>
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 11 }}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 11 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e4e4e7',
            borderRadius: '8px',
            color: '#09090b',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '10px' }}
          iconType="circle"
        />
        <Bar dataKey="commits" name="Commits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="prs" name="PRs Merged" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="reviews" name="Reviews" fill="#a855f7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
