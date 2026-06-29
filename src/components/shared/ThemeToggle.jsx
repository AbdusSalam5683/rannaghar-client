'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-[#3D2410] flex items-center justify-center">
        <div className="w-4 h-4 animate-pulse bg-gray-600 rounded-full" />
      </div>
    );
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // ✅ Force update body class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#C4975A] hover:text-[#F5D9B0] hover:bg-white/8 transition-all duration-200 border border-[#3D2410] hover:border-[#E07B39]/50"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <FaSun className="w-4.5 h-4.5 text-yellow-400" />
      ) : (
        <FaMoon className="w-4.5 h-4.5 text-gray-600" />
      )}
    </button>
  );
}