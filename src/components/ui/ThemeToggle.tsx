'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ width: 36, height: 36 }}
      className="
        inline-flex items-center justify-center rounded-full
        bg-neutral-100 dark:bg-neutral-800
        text-neutral-700 dark:text-neutral-200
        hover:bg-neutral-200 dark:hover:bg-neutral-700
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-neutral-500
      "
    >
      <span className="transition-transform duration-200 ease-in-out">
        {theme === 'dark' ? (
          <Sun size={18} strokeWidth={1.75} />
        ) : (
          <Moon size={18} strokeWidth={1.75} />
        )}
      </span>
    </button>
  );
}
