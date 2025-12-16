"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeatmapProps {
  data: { date: string; count: number }[];
}

export function ContributionHeatmap({ data }: HeatmapProps) {
  // Create a map for quick lookup
  const dataMap = new Map(data.map(d => [d.date, d.count]));
  
  // Generate dates - from start of current month's first week to today
  const weeks: string[][] = [];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Go back ~4 months to show a good range ending at today
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 4);
  startDate.setDate(1); // Start of that month
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Align to Sunday
  
  // Calculate number of weeks needed to reach today
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End of current week (Saturday)
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const numWeeks = Math.ceil(totalDays / 7);
  
  for (let week = 0; week < numWeeks; week++) {
    const weekDates: string[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (week * 7) + day);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    weeks.push(weekDates);
  }
  
  // Get intensity level (0-4)
  const getLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };
  
  const levelColors = [
    'bg-[#161b22] dark:bg-[#161b22]',           // Level 0 - empty
    'bg-[#0e4429] dark:bg-[#0e4429]',           // Level 1
    'bg-[#006d32] dark:bg-[#006d32]',           // Level 2
    'bg-[#26a641] dark:bg-[#26a641]',           // Level 3
    'bg-[#39d353] dark:bg-[#39d353]',           // Level 4
  ];

  const lightLevelColors = [
    'bg-[#ebedf0] dark:bg-[#161b22]',           // Level 0 - empty
    'bg-[#9be9a8] dark:bg-[#0e4429]',           // Level 1
    'bg-[#40c463] dark:bg-[#006d32]',           // Level 2
    'bg-[#30a14e] dark:bg-[#26a641]',           // Level 3
    'bg-[#216e39] dark:bg-[#39d353]',           // Level 4
  ];
  
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  
  // Get month labels for first occurrence of each month
  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  
  weeks.forEach((week, weekIndex) => {
    const date = new Date(week[0]);
    const month = date.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({
        weekIndex,
        label: date.toLocaleDateString('en-US', { month: 'short' })
      });
      lastMonth = month;
    }
  });
  
  const totalContributions = data.reduce((sum, d) => sum + d.count, 0);
  
  // Find max count for relative scaling
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {totalContributions} contributions in the last 4 months
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex mb-1" style={{ marginLeft: '28px' }}>
              {monthLabels.map(({ weekIndex, label }, i) => {
                const nextWeekIndex = monthLabels[i + 1]?.weekIndex || weeks.length;
                const width = (nextWeekIndex - weekIndex) * 14; // 12px box + 2px gap
                return (
                  <div 
                    key={`${label}-${weekIndex}`} 
                    className="text-xs text-neutral-500 dark:text-neutral-400 font-medium"
                    style={{ width: `${width}px` }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
            
            {/* Grid */}
            <div className="flex gap-[2px]">
              {/* Day labels */}
              <div className="flex flex-col gap-[2px] pr-1 w-6">
                {dayLabels.map((day, i) => (
                  <div key={i} className="h-3 text-[10px] text-neutral-400 dark:text-neutral-500 leading-3 flex items-center">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Weeks */}
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.map((date) => {
                    const count = dataMap.get(date) || 0;
                    const level = getLevel(count);
                    const isToday = date === todayStr;
                    const isFuture = date > todayStr;
                    const dateObj = new Date(date);
                    
                    return (
                      <Tooltip key={date}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-3 h-3 rounded-sm transition-all cursor-pointer
                              ${isFuture 
                                ? 'bg-transparent' 
                                : lightLevelColors[level]
                              } 
                              ${isToday ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-neutral-900' : ''} 
                              hover:ring-1 hover:ring-neutral-400 dark:hover:ring-neutral-500`}
                          />
                        </TooltipTrigger>
                        {!isFuture && (
                          <TooltipContent 
                            side="top" 
                            className="bg-neutral-900 dark:bg-neutral-800 text-white border-neutral-700 px-3 py-2"
                          >
                            <p className="font-bold text-sm">
                              {count === 0 ? 'No contributions' : `${count} contribution${count !== 1 ? 's' : ''}`}
                            </p>
                            <p className="text-neutral-400 text-xs">
                              {dateObj.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-3">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Less</span>
              {[0, 1, 2, 3, 4].map(level => (
                <div 
                  key={level} 
                  className={`w-3 h-3 rounded-sm ${lightLevelColors[level]}`} 
                />
              ))}
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">More</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
