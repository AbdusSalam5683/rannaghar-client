'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { recipeService } from '@/services/recipeService';
import { favoriteService } from '@/services/favoriteService';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/shared/Loader';
import { FaHeart, FaRegHeart, FaThumbsUp, FaFlag, FaShoppingCart, FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [recipeData, favoriteData] = await Promise.all([
          recipeService.getById(id),
          isAuthenticated ? favoriteService.check(id) : Promise.resolve({ data: { isFavorite: false } }),
        ]);

        setRecipe(recipeData.data);
        setLikes(recipeData.data.likesCount || 0);
        setIsFavorite(favoriteData.data?.isFavorite || false);
        setIsPremium(user?.isPremium || false);
        
        // Check if user is the author
        if (isAuthenticated && user?.id === recipeData.data.authorId?._id) {
          setIsPurchased(true); // Author can view their own recipe
        }
        
        // Check if recipe is purchased
        // This would come from a purchased check API
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast.error('Recipe not found');
        router.push('/browse-recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like');
      router.push('/login');
      return;
    }
    try {
      const response = await recipeService.like(id);
      setLikes(response.data.likesCount);
      setIsLiked(true);
      toast.success('Liked!');
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to favorite');
      router.push('/login');
      return;
    }
    try {
      if (isFavorite) {
        await favoriteService.remove(id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await favoriteService.add(id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      router.push('/login');
      return;
    }
    // Redirect to payment page
    router.push(`/checkout?recipe=${id}&amount=5`);
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error('Please select a reason');
      return;
    }
    setReportLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: id,
          reason: reportReason,
          description: '',
        }),
      });
      toast.success('Report submitted successfully');
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!recipe) return null;

  const isAuthor = isAuthenticated && user?.id === recipe.authorId?._id;

  return (
    <div className="min-h-screen bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 py-8 md:py-12">
      <div className="container-custom max-w-4xl">
        {/* Back Button */}
        <Link
          href="/browse-recipes"
          className="inline-flex items-center gap-2 text-[#E07B39] hover:text-[#c96a2e] transition mb-6"
        >
          ← Back to Recipes
        </Link>

        {/* Recipe Card */}
        <div className="bg-white dark:bg-[#1A0F0A] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#2C1608] shadow-lg">
          {/* Image */}
          <div className="relative h-72 md:h-96">
            <Image
              src={recipe.recipeImage}
              alt={recipe.recipeName}
              fill
              className="object-cover"
            />
            {recipe.isFeatured && (
              <div className="absolute top-4 left-4 bg-[#E07B39] text-white px-3 py-1 rounded-full text-sm font-bold">
                🌟 Featured
              </div>
            )}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:shadow-xl transition"
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500" size={20} />
                ) : (
                  <FaRegHeart className="text-gray-600" size={20} />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:shadow-xl transition"
              >
                <FaThumbsUp className={`${isLiked ? 'text-[#E07B39]' : 'text-gray-600'}`} size={18} />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0]">
                  {recipe.recipeName}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>👨‍🍳 {recipe.authorName}</span>
                  <span>•</span>
                  <span>{recipe.category}</span>
                  <span>•</span>
                  <span>{recipe.cuisineType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">❤️ {likes}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">⭐ 4.5</span>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mt-4 p-4 bg-gray-50 dark:bg-[#0A0505] rounded-xl">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Difficulty</p>
                <p className="font-medium text-[#2C1A0E] dark:text-[#F5D9B0]">{recipe.difficultyLevel}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Preparation Time</p>
                <p className="font-medium text-[#2C1A0E] dark:text-[#F5D9B0]">⏱️ {recipe.preparationTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                <p className="font-medium text-[#2C1A0E] dark:text-[#F5D9B0]">{recipe.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Cuisine</p>
                <p className="font-medium text-[#2C1A0E] dark:text-[#F5D9B0]">{recipe.cuisineType}</p>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mt-6">
              <h2 className="text-lg font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-3">
                🥘 Ingredients
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recipe.ingredients?.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-[#2C1A0E] dark:text-[#F5D9B0]">
                    <span className="w-2 h-2 rounded-full bg-[#E07B39]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="mt-6">
              <h2 className="text-lg font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-3">
                📖 Instructions
              </h2>
              <ol className="space-y-3">
                {recipe.instructions?.map((step, index) => (
                  <li key={index} className="flex gap-3 text-[#2C1A0E] dark:text-[#F5D9B0]">
                    <span className="font-bold text-[#E07B39] min-w-[24px]">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-[#2C1608]">
              {!isAuthor && !isPurchased && (
                <button
                  onClick={handlePurchase}
                  className="btn-primary flex items-center gap-2"
                >
                  <FaShoppingCart /> Buy Recipe ($5)
                </button>
              )}
              
              {isAuthor && (
                <Link
                  href={`/dashboard/edit-recipe/${recipe._id}`}
                  className="btn-secondary"
                >
                  Edit Recipe
                </Link>
              )}

              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
              >
                <FaFlag className="inline mr-1" /> Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A0F0A] rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-[#2C1608]">
            <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-4">
              Report Recipe
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Why are you reporting this recipe?
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] text-[#2C1A0E] dark:text-[#F5D9B0] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition mb-4"
            >
              <option value="">Select a reason</option>
              <option value="Spam">Spam</option>
              <option value="Offensive Content">Offensive Content</option>
              <option value="Copyright Issue">Copyright Issue</option>
              <option value="Other">Other</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleReport}
                disabled={reportLoading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {reportLoading ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}