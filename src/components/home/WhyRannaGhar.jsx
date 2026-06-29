'use client';

import { motion } from 'framer-motion';
import { FaUtensils, FaUsers, FaStar, FaShieldAlt } from 'react-icons/fa';

const features = [
  {
    icon: FaUtensils,
    title: 'Diverse Recipes',
    description: 'Explore thousands of recipes from various cuisines and cultures.',
  },
  {
    icon: FaUsers,
    title: 'Community Driven',
    description: 'Connect with food lovers and share your culinary journey.',
  },
  {
    icon: FaStar,
    title: 'Premium Content',
    description: 'Access exclusive recipes and cooking tips from top chefs.',
  },
  {
    icon: FaShieldAlt,
    title: 'Quality Assured',
    description: 'Every recipe is reviewed and rated by our community.',
  },
];

export default function WhyRannaGhar() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold font-['Playfair_Display']"
          >
            Why Choose RannaGhar?
          </motion.h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Everything you need to cook, share, and inspire
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white dark:bg-[#1A0F0A] shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 mx-auto bg-[#E07B39]/10 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="text-3xl text-[#E07B39]" />
              </div>
              <h3 className="text-xl font-bold font-['Playfair_Display'] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}