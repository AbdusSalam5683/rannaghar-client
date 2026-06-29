'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Subscribed successfully!');
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-primary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display']">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-[#D4A86A] mt-2">
            Get the latest recipes, cooking tips, and exclusive offers
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#F5D9B0]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F5D9B0] text-[#2C1A0E] px-6 py-3 rounded-lg font-bold hover:bg-[#e8c99a] transition-colors disabled:opacity-50"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          <p className="text-xs text-[#8A6040] mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}