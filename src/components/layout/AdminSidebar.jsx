'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome,
  FaUsers,
  FaUtensils,
  FaFlag,
  FaMoneyBill,
} from 'react-icons/fa';

const menuItems = [
  { href: '/admin', label: 'Overview', icon: FaHome },
  { href: '/admin/manage-users', label: 'Manage Users', icon: FaUsers },
  { href: '/admin/manage-recipes', label: 'Manage Recipes', icon: FaUtensils },
  { href: '/admin/reports', label: 'Reports', icon: FaFlag },
  { href: '/admin/transactions', label: 'Transactions', icon: FaMoneyBill },
];

export default function AdminSidebar() {
  const pathname = usePathname();

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
    </aside>
  );
}