"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface BadgeDisplayProps {
  badges: Badge[];
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  maxVisible?: number;
}

export function BadgeDisplay({ badges, size = "md", showTooltip = true, maxVisible = 5 }: BadgeDisplayProps) {
  const sizeClasses = {
    sm: "w-5 h-5 text-xs",
    md: "w-7 h-7 text-sm",
    lg: "w-10 h-10 text-lg",
  };

  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;

  if (badges.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 flex-wrap">
        {visibleBadges.map((badge) => (
          showTooltip ? (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <div
                  className={`${sizeClasses[size]} rounded-full flex items-center justify-center cursor-pointer
                    transition-transform hover:scale-110 ${badge.color}`}
                >
                  <span>{badge.icon}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="font-semibold">{badge.name}</p>
                <p className="text-xs text-neutral-400">{badge.description}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div
              key={badge.id}
              className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${badge.color}`}
            >
              <span>{badge.icon}</span>
            </div>
          )
        ))}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center cursor-pointer
                  bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium`}
              >
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="font-semibold">{remainingCount} more badges</p>
              <div className="mt-1 space-y-1">
                {badges.slice(maxVisible).map(b => (
                  <p key={b.id} className="text-xs">{b.icon} {b.name}</p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

// Badge Grid for showing all badges with descriptions
interface BadgeGridProps {
  badges: Badge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400 dark:text-neutral-500">
        No badges earned yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="flex flex-col items-center p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 
            border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 
            dark:hover:border-neutral-600 transition-colors"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${badge.color}`}
          >
            {badge.icon}
          </div>
          <h4 className="font-semibold text-sm text-neutral-900 dark:text-white text-center">
            {badge.name}
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-1">
            {badge.description}
          </p>
        </div>
      ))}
    </div>
  );
}
