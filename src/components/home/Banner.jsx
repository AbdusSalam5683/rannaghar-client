'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';

export default function Banner() {
  return (
    <section className="relative bg-gradient-primary overflow-hidden min-h-[80vh] flex items-center">
      <div className="container-custom py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Playfair_Display'] text-white leading-tight">
              Discover & Share
              <br />
              <span className="text-gradient">
                <TypeAnimation
                  sequence={[
                    'Amazing Recipes',
                    2000,
                    'Culinary Secrets',
                    2000,
                    'Food Stories',
                    2000,
                    'Flavors of the World',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </h1>
            <p className="text-lg text-[#D4A86A] max-w-lg">
              Join thousands of food enthusiasts sharing their favorite recipes,
              discovering new flavors, and connecting with cooks worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/browse-recipes" className="btn-primary">
                Explore Recipes
              </Link>
              <Link href="/register" className="btn-secondary">
                Get Started
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-sm text-[#D4A86A]">Recipes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">5K+</p>
                <p className="text-sm text-[#D4A86A]">Chefs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">50K+</p>
                <p className="text-sm text-[#D4A86A]">Likes</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#E07B39] to-[#F5D9B0] p-1">
                <div className="w-full h-full rounded-2xl bg-[#2C1A0E] flex items-center justify-center p-8">
                  <div className="text-center text-white">
                    <div className="text-8xl mb-4">🍳</div>
                    <h3 className="text-2xl font-bold font-['Playfair_Display']">
                      Cook with Passion
                    </h3>
                    <p className="text-[#D4A86A] mt-2">Share your culinary creations</p>
                  </div>
                </div>
              </div>
              {/* Floating Badges */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-[#E07B39] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                🔥 Trending
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-[#F5D9B0] text-[#2C1A0E] px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                ⭐ Premium
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E07B39] opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5D9B0] opacity-5 rounded-full blur-3xl" />
    </section>
  );
}