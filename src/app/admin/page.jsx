'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Loader from '@/components/shared/Loader';
import { FaUsers, FaUtensils, FaCrown, FaFlag } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalPremium: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, recipes, reports] = await Promise.all([
          api.get('/users/stats'),
          api.get('/recipes?limit=1'),
          api.get('/reports/stats'),
        ]);

        setStats({
          totalUsers: users.data?.totalUsers || 0,
          totalRecipes: recipes.data?.pagination?.total || 0,
          totalPremium: users.data?.totalPremium || 0,
          totalReports: reports.data?.pending || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    {
      icon: FaUsers,
      label: 'Total Users',
      value: stats.totalUsers,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      href: '/admin/manage-users',
    },
    {
      icon: FaUtensils,
      label: 'Total Recipes',
      value: stats.totalRecipes,
      color: 'text-[#E07B39]',
      bg: 'bg-[#E07B39]/10',
      href: '/admin/manage-recipes',
    },
    {
      icon: FaCrown,
      label: 'Premium Members',
      value: stats.totalPremium,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      href: '/admin/manage-users',
    },
    {
      icon: FaFlag,
      label: 'Pending Reports',
      value: stats.totalReports,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      href: '/admin/reports',
    },
  ];

  return (
    <div className="bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 min-h-screen py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Overview of platform activity
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              href={stat.href}
              className="bg-white dark:bg-[#1A0F0A] rounded-2xl p-6 shadow-md border border-gray-200 dark:border-[#2C1608] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`text-2xl ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F5D9B0]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/manage-users"
            className="bg-[#E07B39] text-white p-4 rounded-2xl text-center hover:bg-[#c96a2e] transition-colors"
          >
            <div className="text-2xl mb-1">👥</div>
            <p className="font-semibold">Manage Users</p>
          </Link>
          <Link
            href="/admin/manage-recipes"
            className="bg-white dark:bg-[#1A0F0A] border border-gray-200 dark:border-[#2C1608] p-4 rounded-2xl text-center hover:shadow-lg transition-all text-[#2C1A0E] dark:text-[#F5D9B0]"
          >
            <div className="text-2xl mb-1">📖</div>
            <p className="font-semibold">Manage Recipes</p>
          </Link>
          <Link
            href="/admin/reports"
            className="bg-white dark:bg-[#1A0F0A] border border-gray-200 dark:border-[#2C1608] p-4 rounded-2xl text-center hover:shadow-lg transition-all text-[#2C1A0E] dark:text-[#F5D9B0]"
          >
            <div className="text-2xl mb-1">🚩</div>
            <p className="font-semibold">Reports</p>
          </Link>
          <Link
            href="/admin/transactions"
            className="bg-white dark:bg-[#1A0F0A] border border-gray-200 dark:border-[#2C1608] p-4 rounded-2xl text-center hover:shadow-lg transition-all text-[#2C1A0E] dark:text-[#F5D9B0]"
          >
            <div className="text-2xl mb-1">💰</div>
            <p className="font-semibold">Transactions</p>
          </Link>
        </div>
      </div>
    </div>
  );
}