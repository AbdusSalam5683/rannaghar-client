'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { favoriteService } from '@/services/favoriteService';
import Loader from '@/components/shared/Loader';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await favoriteService.getMyFavorites();
      setFavorites(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (recipeId) => {
    try {
      await favoriteService.remove(recipeId);
      setFavorites(favorites.filter((f) => f.recipeId._id !== recipeId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 min-h-screen py-8">
      <div className="container-custom max-w-5xl">
        <h1 className="text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-2">
          ❤️ My Favorites
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {favorites.length} saved recipe{favorites.length !== 1 ? 's' : ''}
        </p>

        {favorites.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1A0F0A] rounded-2xl border border-gray-200 dark:border-[#2C1608]">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-bold text-[#2C1A0E] dark:text-[#F5D9B0]">
              No favorites yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Start saving recipes you love!
            </p>
            <Link href="/browse-recipes" className="btn-primary inline-block mt-4">
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((fav) => {
              const recipe = fav.recipeId;
              return (
                <div
                  key={recipe._id}
                  className="bg-white dark:bg-[#1A0F0A] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#2C1608] flex flex-col"
                >
                  <Link href={`/recipe/${recipe._id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={recipe.recipeImage}
                        alt={recipe.recipeName}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <Link href={`/recipe/${recipe._id}`}>
                      <h3 className="text-lg font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] hover:text-[#E07B39] transition">
                        {recipe.recipeName}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      👨‍🍳 {recipe.authorName}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#2C1608]">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ❤️ {recipe.likesCount || 0}
                      </span>
                      <button
                        onClick={() => handleRemove(recipe._id)}
                        className="text-red-500 hover:text-red-600 transition flex items-center gap-1 text-sm"
                      >
                        <FaTrash size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}