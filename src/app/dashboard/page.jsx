'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { FaUtensils, FaHeart, FaThumbsUp, FaCrown } from 'react-icons/fa';
import Loader from '@/components/shared/Loader';
import Link from 'next/link';

export default function DashboardOverview() {
  const { user, isPremium } = useAuth();
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalFavorites: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [recipes, favorites] = await Promise.all([
          api.get('/recipes/user/my-recipes'),
          api.get('/favorites'),
        ]);

        const totalLikes = recipes.data?.reduce(
          (sum, recipe) => sum + (recipe.likesCount || 0),
          0
        );

        setStats({
          totalRecipes: recipes.data?.length || 0,
          totalFavorites: favorites.data?.length || 0,
          totalLikes: totalLikes || 0,
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
      icon: FaUtensils,
      label: 'Total Recipes',
      value: stats.totalRecipes,
      color: 'text-[#E07B39]',
      bg: 'bg-[#E07B39]/10',
    },
    {
      icon: FaHeart,
      label: 'Total Favorites',
      value: stats.totalFavorites,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      icon: FaThumbsUp,
      label: 'Total Likes Received',
      value: stats.totalLikes,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0]">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          {isPremium && (
            <span className="flex items-center gap-1 px-3 py-1 bg-[#E07B39] text-white text-xs font-bold rounded-full">
              <FaCrown size={12} />
              PREMIUM
            </span>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's what's happening with your recipes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#1A0F0A] rounded-2xl p-6 shadow-md border border-gray-200 dark:border-[#2C1608] transition-all duration-300 hover:shadow-lg"
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
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/add-recipe"
          className="bg-[#E07B39] text-white p-4 rounded-2xl text-center hover:bg-[#c96a2e] transition-colors"
        >
          <div className="text-2xl mb-1">➕</div>
          <p className="font-semibold">Add Recipe</p>
          <p className="text-xs opacity-80">
            {isPremium
              ? 'Unlimited recipes'
              : `${2 - stats.totalRecipes} remaining`}
          </p>
        </Link>

        <Link
          href="/dashboard/my-recipes"
          className="bg-white dark:bg-[#1A0F0A] border border-gray-200 dark:border-[#2C1608] p-4 rounded-2xl text-center hover:shadow-lg transition-all text-[#2C1A0E] dark:text-[#F5D9B0]"
        >
          <div className="text-2xl mb-1">📖</div>
          <p className="font-semibold">My Recipes</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {stats.totalRecipes} recipes
          </p>
        </Link>

        <Link
          href="/dashboard/my-favorites"
          className="bg-white dark:bg-[#1A0F0A] border border-gray-200 dark:border-[#2C1608] p-4 rounded-2xl text-center hover:shadow-lg transition-all text-[#2C1A0E] dark:text-[#F5D9B0]"
        >
          <div className="text-2xl mb-1">❤️</div>
          <p className="font-semibold">Favorites</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {stats.totalFavorites} saved
          </p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="bg-white dark:bg-[#1A0F0A] border border-gray-200 dark:border-[#2C1608] p-4 rounded-2xl text-center hover:shadow-lg transition-all text-[#2C1A0E] dark:text-[#F5D9B0]"
        >
          <div className="text-2xl mb-1">👤</div>
          <p className="font-semibold">Profile</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Update your info</p>
        </Link>
      </div>

      {/* Premium Banner (if not premium) */}
      {!isPremium && (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-primary text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold font-['Playfair_Display']">
                🚀 Upgrade to Premium
              </h3>
              <p className="text-[#D4A86A] text-sm mt-1">
                Unlock unlimited recipes, exclusive content, and more!
              </p>
            </div>
            <Link
              href="/dashboard/upgrade"
              className="px-6 py-3 bg-[#F5D9B0] text-[#2C1A0E] rounded-lg font-bold hover:bg-[#e8c99a] transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}