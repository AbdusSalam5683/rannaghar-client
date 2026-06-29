'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { recipeService } from '@/services/recipeService';
import Loader from '@/components/shared/Loader';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getMyRecipes();
      setRecipes(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Recipe?',
      text: `Are you sure you want to delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E07B39',
      cancelButtonColor: '#6B4A28',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await recipeService.delete(id);
        toast.success('Recipe deleted successfully');
        fetchRecipes();
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 min-h-screen py-8">
      <div className="container-custom max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0]">
              My Recipes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} created
            </p>
          </div>
          <Link href="/dashboard/add-recipe" className="btn-primary text-sm">
            + Add Recipe
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1A0F0A] rounded-2xl border border-gray-200 dark:border-[#2C1608]">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-bold text-[#2C1A0E] dark:text-[#F5D9B0]">
              No recipes yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Start sharing your culinary creations!
            </p>
            <Link href="/dashboard/add-recipe" className="btn-primary inline-block mt-4">
              Create First Recipe
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white dark:bg-[#1A0F0A] rounded-2xl p-4 border border-gray-200 dark:border-[#2C1608] flex flex-col md:flex-row items-start md:items-center gap-4 transition-all hover:shadow-md"
              >
                <div className="relative w-full md:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] line-clamp-1">
                    {recipe.recipeName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>{recipe.category}</span>
                    <span>•</span>
                    <span>{recipe.cuisineType}</span>
                    <span>•</span>
                    <span>⏱️ {recipe.preparationTime}</span>
                    <span>•</span>
                    <span>❤️ {recipe.likesCount || 0}</span>
                    {recipe.isFeatured && (
                      <span className="bg-[#E07B39] text-white text-xs px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/recipe/${recipe._id}`}
                    className="p-2 text-gray-500 hover:text-[#E07B39] transition"
                    aria-label="View"
                  >
                    <FaEye size={18} />
                  </Link>
                  <Link
                    href={`/dashboard/edit-recipe/${recipe._id}`}
                    className="p-2 text-gray-500 hover:text-blue-500 transition"
                    aria-label="Edit"
                  >
                    <FaEdit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe._id, recipe.recipeName)}
                    className="p-2 text-gray-500 hover:text-red-500 transition"
                    aria-label="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}