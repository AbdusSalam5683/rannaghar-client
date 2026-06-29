'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { paymentService } from '@/services/paymentService';
import { getStripe } from '@/lib/stripe';
import Loader from '@/components/shared/Loader';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [amount, setAmount] = useState(0);
  const [paymentType, setPaymentType] = useState('');

  const recipeId = searchParams.get('recipe');
  const type = searchParams.get('type') || 'recipe_purchase';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (type === 'premium_membership') {
          setAmount(10);
          setPaymentType('premium_membership');
          setRecipe({ recipeName: 'Premium Membership', recipeImage: '👑' });
        } else if (recipeId) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeId}`, {
            credentials: 'include',
          });
          const data = await response.json();
          setRecipe(data.data);
          setAmount(5);
          setPaymentType('recipe_purchase');
        } else {
          toast.error('Invalid checkout');
          router.push('/browse-recipes');
        }
      } catch (error) {
        toast.error('Failed to load checkout');
        router.push('/browse-recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [recipeId, type, isAuthenticated, router]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await paymentService.createIntent(amount, paymentType, recipeId);
      
      if (response.success) {
        const stripe = await getStripe();
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.clientSecret,
        });
        
        if (error) {
          toast.error(error.message);
        }
      } else {
        toast.error('Failed to create payment');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#1A0F0A] rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-[#2C1608]">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {paymentType === 'premium_membership' ? '👑' : '🍳'}
          </div>
          <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0]">
            {paymentType === 'premium_membership' ? 'Premium Membership' : 'Recipe Purchase'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {paymentType === 'premium_membership'
              ? 'Unlock unlimited recipes and premium features'
              : `Purchase "${recipe?.recipeName || 'Recipe'}"`}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0505] rounded-xl">
            <span className="text-gray-600 dark:text-gray-300">Amount</span>
            <span className="text-2xl font-bold text-[#2C1A0E] dark:text-[#F5D9B0]">
              ${amount}
            </span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : `Pay $${amount}`}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full text-gray-500 dark:text-gray-400 hover:text-[#E07B39] transition text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}