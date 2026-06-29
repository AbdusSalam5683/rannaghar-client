'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* SVG Icon with Steam Animation */}
      <div className="relative w-9 h-9">
        <svg viewBox="0 0 38 38" fill="none" className="w-full h-full">
          {/* Steam Lines */}
          <g className="animate-steam" style={{ transformOrigin: '13px 10px' }}>
            <path d="M13 11 C11 8 15 6 13 3" stroke="#E07B39" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <g className="animate-steam-2" style={{ transformOrigin: '19px 9px' }}>
            <path d="M19 10 C17 7 21 5 19 2" stroke="#C8622A" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <g className="animate-steam-3" style={{ transformOrigin: '25px 11px' }}>
            <path d="M25 11 C23 8 27 6 25 3" stroke="#E07B39" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Lid */}
          <rect x="11" y="14" width="16" height="2.5" rx="1.25" fill="#C8622A" />
          <ellipse cx="19" cy="13.5" rx="9.5" ry="2.5" fill="#D97040" />
          <rect x="16.5" y="10" width="5" height="4" rx="2.5" fill="#B05A2A" />

          {/* Pot Body */}
          <path d="M10 17 Q9 27 10.5 29.5 L27.5 29.5 Q29 27 28 17 Z" fill="#E07B39" />

          {/* Handles */}
          <rect x="6" y="18" width="6" height="3.5" rx="1.75" fill="#B05A2A" />
          <rect x="26" y="18" width="6" height="3.5" rx="1.75" fill="#B05A2A" />

          {/* Base */}
          <rect x="9" y="29.5" width="20" height="3" rx="1.5" fill="#C8622A" />
        </svg>
      </div>

      {/* Text */}
      <div className="leading-none">
        <span className="block font-serif font-bold text-xl text-[#F5D9B0] group-hover:text-[#E07B39] transition-colors duration-200">
          RannaGhar
        </span>
        <span className="block text-[8.5px] text-[#8A5A30] tracking-[3px] uppercase font-sans">
          Recipe Platform
        </span>
      </div>

      {/* Global Animation Styles */}
      <style jsx>{`
        @keyframes steam {
          0%,
          100% {
            opacity: 0;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-4px);
          }
          80% {
            opacity: 0;
            transform: translateY(-8px);
          }
        }
        .animate-steam {
          animation: steam 2s ease-in-out infinite;
        }
        .animate-steam-2 {
          animation: steam 2s 0.5s ease-in-out infinite;
        }
        .animate-steam-3 {
          animation: steam 2s 1s ease-in-out infinite;
        }
      `}</style>
    </Link>
  );
}