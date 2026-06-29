import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import Providers from '@/providers/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
});

export const metadata = {
  title: 'RannaGhar - Recipe Sharing Platform',
  description: 'Share, discover, and manage recipes with food enthusiasts around the world.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable}`}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300">
            <Navbar />
            <main className="flex-grow pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}