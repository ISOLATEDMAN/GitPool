"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

interface TierChartProps {
  data: { tier: string; count: number; fill: string }[];
}

export function TierBarChart({ data }: TierChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" hide />
        <YAxis 
          type="category" 
          dataKey="tier" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'currentColor', fontWeight: 600, fontSize: 14 }}
          width={30}
          className="text-neutral-500 dark:text-neutral-400"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            color: 'var(--color-card-foreground)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
          formatter={(value: number) => [`${value} devs`, 'Count']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TierPieChart({ data }: TierChartProps) {
  const filteredData = data.filter(d => d.count > 0);
  
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="count"
          nameKey="tier"
          label={({ name, value }) => `${name}: ${value}`}
          labelLine={false}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            color: 'var(--color-card-foreground)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
          formatter={(value: number) => [`${value} devs`, 'Count']}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
