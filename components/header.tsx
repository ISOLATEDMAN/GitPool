"use client";

import { Trophy, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="w-5 h-5 text-white dark:text-neutral-900" />
            </div>
            <div>
              <h1 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">GitPool</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Team Leaderboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a 
              href="https://github.com/ISOLATEDMAN/GitPool" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <Badge variant="outline" className="gap-1 dark:border-neutral-700 dark:text-neutral-300">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
