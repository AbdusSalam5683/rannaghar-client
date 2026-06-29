'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/services/api';
import { recipeService } from '@/services/recipeService';
import Loader from '@/components/shared/Loader';
import Pagination from '@/components/shared/Pagination';
import { FaEdit, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchRecipes();
  }, [pagination.page]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getAll(pagination.page, pagination.limit);
      setRecipes(data.data.recipes || []);
      setPagination({
        ...pagination,
        total: data.data.pagination.total,
        pages: data.data.pagination.pages,
      });
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

  const handleFeatureToggle = async (id, currentStatus) => {
    try {
      await api.patch(`/recipes/${id}/feature`);
      toast.success(`Recipe ${currentStatus ? 'unfeatured' : 'featured'} successfully`);
      fetchRecipes();
    } catch (error) {
      toast.error('Failed to toggle feature');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 min-h-screen py-8">
      <div className="container-custom max-w-6xl">
        <h1 className="text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-2">
          📖 Manage Recipes
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {pagination.total} total recipes
        </p>

        <div className="bg-white dark:bg-[#1A0F0A] rounded-2xl border border-gray-200 dark:border-[#2C1608] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0A0505] border-b border-gray-200 dark:border-[#2C1608]">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Recipe</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Author</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr
                    key={recipe._id}
                    className="border-b border-gray-100 dark:border-[#2C1608] hover:bg-gray-50 dark:hover:bg-[#0A0505] transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={recipe.recipeImage}
                            alt={recipe.recipeName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-[#2C1A0E] dark:text-[#F5D9B0] line-clamp-1">
                          {recipe.recipeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {recipe.authorName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {recipe.category}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recipe.isFeatured
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {recipe.isFeatured ? '⭐ Featured' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFeatureToggle(recipe._id, recipe.isFeatured)}
                          className={`p-2 rounded-lg transition ${
                            recipe.isFeatured
                              ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                              : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          title={recipe.isFeatured ? 'Remove Featured' : 'Make Featured'}
                        >
                          {recipe.isFeatured ? <FaStar size={18} /> : <FaRegStar size={18} />}
                        </button>
                        <Link
                          href={`/dashboard/edit-recipe/${recipe._id}`}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(recipe._id, recipe.recipeName)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recipes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No recipes found</p>
            </div>
          )}
        </div>

        {pagination.pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
          />
        )}
      </div>
    </div>
  );
}