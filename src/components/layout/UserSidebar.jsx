'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome,
  FaUtensils,
  FaPlus,
  FaHeart,
  FaShoppingBag,
  FaUser,
} from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { href: '/dashboard', label: 'Overview', icon: FaHome },
  { href: '/dashboard/my-recipes', label: 'My Recipes', icon: FaUtensils },
  { href: '/dashboard/add-recipe', label: 'Add Recipe', icon: FaPlus },
  { href: '/dashboard/my-favorites', label: 'Favorites', icon: FaHeart },
  { href: '/dashboard/purchased', label: 'Purchased', icon: FaShoppingBag },
  { href: '/dashboard/profile', label: 'Profile', icon: FaUser },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const { isPremium } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-[#1A0F0A] border-r border-gray-200 dark:border-gray-800 hidden md:block p-4">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname === item.href
                ? 'bg-[#E07B39] text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {isPremium && (
        <div className="mt-6 p-4 bg-gradient-primary rounded-xl text-white">
          <p className="text-sm font-bold">⭐ Premium Member</p>
          <p className="text-xs opacity-80 mt-1">Unlimited recipes unlocked</p>
        </div>
      )}
    </aside>
  );
}