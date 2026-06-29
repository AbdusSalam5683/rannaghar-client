'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/browse-recipes', label: 'Browse Recipes' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/add-recipe', label: 'Add Recipe' },
  { href: '/dashboard/my-favorites', label: 'My Favourites' },
];

const categories = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Desserts',
  'Vegetarian',
  'Seafood',
];

const socials = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
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
    <footer className="bg-[#120A03] border-t border-[#2C1608]">
      {/* Top Wave */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 40" className="w-full h-8 text-[#1A0C04]" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,32 C360,0 1080,0 1440,32 L1440,40 L0,40 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 relative">
                <svg viewBox="0 0 38 38" fill="none" className="w-full h-full">
                  <path d="M10 17 Q9 27 10.5 29.5 L27.5 29.5 Q29 27 28 17 Z" fill="#E07B39" />
                  <rect x="11" y="14" width="16" height="2.5" rx="1.25" fill="#C8622A" />
                  <ellipse cx="19" cy="13.5" rx="9.5" ry="2.5" fill="#D97040" />
                  <rect x="16.5" y="10" width="5" height="4" rx="2.5" fill="#B05A2A" />
                  <rect x="6" y="18" width="6" height="3.5" rx="1.75" fill="#B05A2A" />
                  <rect x="26" y="18" width="6" height="3.5" rx="1.75" fill="#B05A2A" />
                  <rect x="9" y="29.5" width="20" height="3" rx="1.5" fill="#C8622A" />
                </svg>
              </div>
              <div>
                <span className="block font-serif font-bold text-xl text-[#F5D9B0] group-hover:text-[#E07B39] transition-colors">
                  RannaGhar
                </span>
                <span className="block text-[8.5px] text-[#5C3A1E] tracking-[3px] uppercase">
                  Recipe Platform
                </span>
              </div>
            </Link>

            <p className="mt-4 text-sm text-[#6B4A28] leading-relaxed max-w-sm">
              A community for food lovers — discover new flavours, share family
              recipes, and connect with cooks from around the world.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2.5 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg border border-[#2C1608] flex items-center justify-center text-[#6B4A28] hover:border-[#E07B39]/50 hover:text-[#E07B39] hover:bg-[#E07B39]/8 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-semibold text-[#E07B39] tracking-[2.5px] uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm text-[#6B4A28] hover:text-[#D4A86A] transition-colors duration-150 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#3D2410] group-hover:bg-[#E07B39] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[10px] font-semibold text-[#E07B39] tracking-[2.5px] uppercase mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/browse-recipes?category=${cat.toLowerCase()}`}
                    className="flex items-center gap-1.5 text-sm text-[#6B4A28] hover:text-[#D4A86A] transition-colors duration-150 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#3D2410] group-hover:bg-[#E07B39] transition-colors" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-[10px] font-semibold text-[#E07B39] tracking-[2.5px] uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@rannaghar.com"
                  className="flex items-start gap-2.5 text-sm text-[#6B4A28] hover:text-[#D4A86A] transition-colors group"
                >
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-[#E07B39] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  hello@rannaghar.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2.5 text-sm text-[#6B4A28] hover:text-[#D4A86A] transition-colors group"
                >
                  <svg
                    className="w-4 h-4 shrink-0 group-hover:text-[#E07B39] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.82a16 16 0 0 0 6.29 6.29l1.2-.82a2 2 0 0 1 2.1-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +880 1700-000000
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2.5 text-sm text-[#6B4A28]">
                  <svg
                    className="w-4 h-4 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>

            {/* Newsletter Mini */}
            <div className="mt-5">
              <p className="text-xs text-[#4A2E12] mb-2">Get recipe updates</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 text-sm px-3 py-2 rounded-lg bg-[#1E0F05] border border-[#2C1608] text-[#C4975A] placeholder-[#3D2410] focus:outline-none focus:border-[#E07B39]/50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-2 rounded-lg bg-[#E07B39] hover:bg-[#C8622A] text-white text-sm font-medium transition-colors shrink-0 disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Divider & Bottom */}
        <div className="mt-10 border-t border-[#2C1608] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#3D2410]">
            © {new Date().getFullYear()} RannaGhar. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-xs text-[#3D2410] hover:text-[#6B4A28] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-[#2C1608]">·</span>
            <Link
              href="#"
              className="text-xs text-[#3D2410] hover:text-[#6B4A28] transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}