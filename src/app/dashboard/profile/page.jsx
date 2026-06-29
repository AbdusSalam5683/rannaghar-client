'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '@/utils/validators';
import { toast } from 'react-hot-toast';
import { api } from '@/services/api';
import { uploadImageToImgbb } from '@/utils/uploadImage';
import { FaSpinner, FaCrown } from 'react-icons/fa';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, getCurrentUser, isPremium } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      image: user?.image || '',
    },
  });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = data.image;

      if (imageFile) {
        const uploadedUrl = await uploadImageToImgbb(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toast.error('Image upload failed');
          return;
        }
      }

      await api.put('/users/profile', {
        name: data.name,
        image: imageUrl,
      });

      toast.success('Profile updated successfully!');
      await getCurrentUser();
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 min-h-screen py-8">
      <div className="container-custom max-w-2xl">
        <h1 className="text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Update your personal information
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-[#1A0F0A] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-[#2C1608] space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#E07B39]/30">
                <Image
                  src={imagePreview || user?.image || 'https://ui-avatars.com/api/?name=User'}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="px-4 py-2 text-sm text-[#E07B39] border border-[#E07B39] rounded-lg hover:bg-[#E07B39] hover:text-white transition cursor-pointer"
                >
                  Change Photo
                </label>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] text-[#2C1A0E] dark:text-[#F5D9B0] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Premium Status */}
          <div className="bg-[#E07B39]/10 dark:bg-[#E07B39]/5 rounded-lg p-4 border border-[#E07B39]/20">
            <div className="flex items-center gap-2">
              <FaCrown className="text-[#E07B39]" />
              <span className="font-semibold text-[#2C1A0E] dark:text-[#F5D9B0]">
                Membership Status
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isPremium
                  ? 'bg-[#E07B39] text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {isPremium ? '✨ Premium' : 'Free'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {isPremium
                ? 'You have unlimited recipe uploads and premium features!'
                : 'Upgrade to premium for unlimited recipes and exclusive content.'}
            </p>
            {!isPremium && (
              <Link href="/dashboard/upgrade" className="btn-primary text-sm inline-block mt-3">
                Upgrade Now
              </Link>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}