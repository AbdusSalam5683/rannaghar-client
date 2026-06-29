'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { recipeService } from '@/services/recipeService';
import Loader from '@/components/shared/Loader';

export default function PopularRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await recipeService.getPopular();
        setRecipes(data.data || []);
      } catch (error) {
        console.error('Error fetching popular recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  if (loading) return <Loader />;
  if (!recipes.length) return null;

  return (
    <section className="py-16 md:py-20 bg-gray-50 dark:bg-[#0F0805]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold font-['Playfair_Display']"
          >
            ⭐ Popular Recipes
          </motion.h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Most loved recipes by our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recipes.slice(0, 6).map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="recipe-card group"
            >
              <Link href={`/recipe/${recipe._id}`}>
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <Image
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    ❤️ {recipe.likesCount || 0}
                  </div>
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-lg md:text-xl font-bold font-['Playfair_Display'] line-clamp-1">
                    {recipe.recipeName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    By {recipe.authorName}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-yellow-400">⭐⭐⭐⭐</span>
                    <span className="text-sm text-gray-500">(4.5)</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}