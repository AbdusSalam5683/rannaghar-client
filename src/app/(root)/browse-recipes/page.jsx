'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { recipeService } from '@/services/recipeService';
import { favoriteService } from '@/services/favoriteService';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/shared/Loader';
import Pagination from '@/components/shared/Pagination';
import { FaSearch, FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function BrowseRecipesPage() {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await recipeService.getCategories();
        setCategories(data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await recipeService.getAll(
          pagination.page,
          pagination.limit,
          category
        );
        setRecipes(data.data.recipes || []);
        setPagination({
          ...pagination,
          total: data.data.pagination.total,
          pages: data.data.pagination.pages,
        });
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      if (isAuthenticated) {
        try {
          const data = await favoriteService.getMyFavorites();
          setFavorites(data.data.map((fav) => fav.recipeId._id) || []);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    fetchRecipes();
    fetchFavorites();
  }, [pagination.page, category, isAuthenticated]);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 py-8 md:py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0]">
            Browse Recipes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Discover amazing recipes from our community
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-[#1A0F0A] border border-gray-200 dark:border-[#2C1608] rounded-lg px-4 py-2 flex-1 max-w-sm">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="bg-transparent focus:outline-none text-[#2C1A0E] dark:text-[#F5D9B0] w-full"
            />
          </div>

          <select
            value={category}
            onChange={handleCategoryChange}
            className="bg-white dark:bg-[#1A0F0A] border border-gray-200 dark:border-[#2C1608] rounded-lg px-4 py-2 text-[#2C1A0E] dark:text-[#F5D9B0] focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Recipe Grid */}
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-[#2C1A0E] dark:text-[#F5D9B0]">
              No recipes found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => {
              const isFavorite = favorites.includes(recipe._id);
              return (
                <div
                  key={recipe._id}
                  className="recipe-card group bg-white dark:bg-[#1A0F0A] border border-gray-200 dark:border-[#2C1608] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <Link href={`/recipe/${recipe._id}`}>
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={recipe.recipeImage}
                        alt={recipe.recipeName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (!isAuthenticated) {
                              toast.error('Please login to favorite');
                              return;
                            }
                            // Handle favorite toggle
                          }}
                          className="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:scale-110 transition"
                        >
                          {isFavorite ? (
                            <FaHeart className="text-red-500" size={16} />
                          ) : (
                            <FaRegHeart className="text-gray-600" size={16} />
                          )}
                        </button>
                      </div>
                      {recipe.isFeatured && (
                        <div className="absolute top-3 left-3 bg-[#E07B39] text-white px-3 py-1 rounded-full text-xs font-bold">
                          🌟 Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] line-clamp-1">
                        {recipe.recipeName}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{recipe.category}</span>
                        <span>•</span>
                        <span>{recipe.cuisineType}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#2C1608]">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <span>❤️ {recipe.likesCount || 0}</span>
                          <span>•</span>
                          <span>👨‍🍳 {recipe.authorName}</span>
                        </div>
                        <span className="text-sm text-[#E07B39] font-semibold">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}