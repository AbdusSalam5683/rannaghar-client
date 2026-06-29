'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/services/api';
import Loader from '@/components/shared/Loader';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function PurchasedPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchased = async () => {
      try {
        const data = await api.get('/payments/history');
        // Filter only completed recipe purchases
        const recipePurchases = data.data.filter(
          (p) => p.paymentType === 'recipe_purchase' && p.paymentStatus === 'completed'
        );
        setPurchases(recipePurchases);
      } catch (error) {
        toast.error('Failed to fetch purchased recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchased();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 min-h-screen py-8">
      <div className="container-custom max-w-5xl">
        <h1 className="text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-2">
          🛒 Purchased Recipes
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {purchases.length} recipe{purchases.length !== 1 ? 's' : ''} purchased
        </p>

        {purchases.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1A0F0A] rounded-2xl border border-gray-200 dark:border-[#2C1608]">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-[#2C1A0E] dark:text-[#F5D9B0]">
              No purchases yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Buy premium recipes from our chefs!
            </p>
            <Link href="/browse-recipes" className="btn-primary inline-block mt-4">
              Browse Recipes
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {purchases.map((purchase) => {
              const recipe = purchase.recipeId;
              if (!recipe) return null;
              return (
                <div
                  key={purchase._id}
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
                      <span>👨‍🍳 {recipe.authorName}</span>
                      <span>•</span>
                      <span>${purchase.amount}</span>
                      <span>•</span>
                      <span className="text-green-500">✅ Purchased</span>
                    </div>
                  </div>
                  <Link
                    href={`/recipe/${recipe._id}`}
                    className="btn-primary text-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    <FaEye /> View Recipe
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}