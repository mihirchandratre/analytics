'use client';

import { useDarkMode } from '@/hooks/useDarkMode';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Beaker } from 'lucide-react';

export default function Header() {
  const { isDark, toggleDarkMode, mounted } = useDarkMode();

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
          <Beaker className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Analyst Toolkit
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Professional lab calculators & reference tools
          </p>
        </div>
      </div>
      
      {mounted && (
        <Button
          onClick={toggleDarkMode}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? 'Light' : 'Dark'}
        </Button>
      )}
    </header>
  );
}