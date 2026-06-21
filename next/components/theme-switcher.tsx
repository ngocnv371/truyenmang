'use client';

import { FiSun, FiMoon } from 'react-icons/fi';

import { useTheme } from '@/context/theme-context';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-white hover:bg-neutral-800 hover:text-white/80 transition duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <FiSun className="h-4 w-4" />
      ) : (
        <FiMoon className="h-4 w-4" />
      )}
    </button>
  );
}
