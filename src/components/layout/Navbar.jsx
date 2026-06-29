'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/shared/Logo';
import ThemeToggle from '@/components/shared/ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/browse-recipes', label: 'Browse Recipes' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1E0F05]/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-[#1E0F05]'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? 'text-[#F5D9B0] bg-[#E07B39]/20'
                  : 'text-[#C4975A] hover:text-[#F5D9B0] hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname.startsWith('/dashboard')
                  ? 'text-[#F5D9B0] bg-[#E07B39]/20'
                  : 'text-[#C4975A] hover:text-[#F5D9B0] hover:bg-white/5'
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard/profile" className="flex items-center gap-2 group">
                <div className="relative">
                  <img
                    src={session.user?.image || '/avatar-placeholder.png'}
                    alt={session.user?.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#E07B39]/40 group-hover:border-[#E07B39] transition-all duration-200"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1E0F05]" />
                </div>
                <span className="text-sm text-[#C4975A] group-hover:text-[#F5D9B0] transition-colors max-w-[90px] truncate">
                  {session.user?.name?.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-1.5 text-sm text-[#C4975A] border border-[#3D2410] rounded-lg hover:border-[#E07B39]/50 hover:text-[#F5D9B0] transition-all duration-200"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-[#C4975A] border border-[#3D2410] rounded-lg hover:border-[#E07B39]/50 hover:text-[#F5D9B0] transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-[#E07B39] rounded-lg hover:bg-[#C8622A] transition-all duration-200 shadow-md shadow-[#E07B39]/20"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: Theme + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center text-[#C4975A] hover:text-[#F5D9B0] transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${
                menuOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 border-t border-[#3D2410]/60 bg-[#1A0C04]">
          <div className="pt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'text-[#F5D9B0] bg-[#E07B39]/15'
                    : 'text-[#C4975A] hover:text-[#F5D9B0] hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#C4975A] hover:text-[#F5D9B0] hover:bg-white/5 transition-all"
              >
                Dashboard
              </Link>
            )}
            <div className="border-t border-[#3D2410]/60 mt-2 pt-2 flex flex-col gap-2">
              {session ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img
                      src={session.user?.image || '/avatar-placeholder.png'}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-[#E07B39]/40 object-cover"
                    />
                    <span className="text-sm text-[#F5D9B0]">
                      {session.user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="mx-2 py-2.5 text-sm text-[#C4975A] border border-[#3D2410] rounded-lg hover:text-[#F5D9B0] transition-all"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="mx-2 py-2.5 text-center text-sm text-[#C4975A] border border-[#3D2410] rounded-lg hover:text-[#F5D9B0] transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="mx-2 py-2.5 text-center text-sm font-semibold text-white bg-[#E07B39] rounded-lg hover:bg-[#C8622A] transition-all"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}