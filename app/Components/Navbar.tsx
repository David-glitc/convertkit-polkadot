"use client";
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the theme is mounted correctly for SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering until mounted
  if (!mounted) return null;

  return (
    <nav className="flex sticky px-20 items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 shadow-lg">
      {/* App Name */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Converkit-Polkadot
      </h1>

      {/* Theme Toggle Button */}
      <button
        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun className="text-yellow-400"/> : <Moon className="text-gray-800"/>}
      </button>
    </nav>
  );
}
