'use client';

import Banner from '@/components/home/Banner';
import FeaturedRecipes from '@/components/home/FeaturedRecipes';
import PopularRecipes from '@/components/home/PopularRecipes';
import Newsletter from '@/components/home/Newsletter';
import WhyRannaGhar from '@/components/home/WhyRannaGhar';
import ScrollToTop from 'react-scroll-to-top';

export default function HomePage() {
  return (
    <div>
      <Banner />
      <FeaturedRecipes />
      <PopularRecipes />
      <WhyRannaGhar />
      <Newsletter />
      <ScrollToTop smooth color="#E07B39" style={{ backgroundColor: '#1E0F05' }} />
    </div>
  );
}