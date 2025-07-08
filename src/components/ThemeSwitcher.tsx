'use client';

import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleTheme}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-md px-3 py-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title={theme === 'light' ? t.darkMode : t.lightMode}
      >
        {theme === 'light' ? (
          <>
            <Moon size={16} className="text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t.darkMode}
            </span>
          </>
        ) : (
          <>
            <Sun size={16} className="text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t.lightMode}
            </span>
          </>
        )}
      </button>
    </div>
  );
}