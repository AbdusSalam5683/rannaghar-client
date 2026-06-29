'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/utils/validators';
import { toast } from 'react-hot-toast';
import { api } from '@/services/api';
import { FaGoogle, FaCloudUploadAlt, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      image: '',
    },
  });

  const password = watch('password');

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Please select a valid image (JPEG, PNG, WEBP, GIF)');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Upload image to imgbb
  const uploadImage = async (file) => {
    const API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    
    if (!API_KEY) {
      toast.error('Image upload service not configured');
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setImageUploading(true);
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload image');
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let imageUrl = '';

      // Upload image if selected
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          // Continue without image if upload fails
          toast.warning('Profile image upload failed, continuing without image');
        }
      }

      const response = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        image: imageUrl || '',
      });

      if (response.success) {
        toast.success('Registration successful! Please login.');
        router.push('/login');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue('image', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-[#1A0F0A] rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-['Playfair_Display']">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Start your culinary journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Profile Image
            </label>

            {/* Upload Area */}
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-[#E07B39] transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click to upload your profile photo
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  JPEG, PNG, WEBP, GIF (max 5MB)
                </p>
              </div>
            ) : (
              // Image Preview
              <div className="relative">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#E07B39]/30">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex justify-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-sm text-[#E07B39] border border-[#E07B39] rounded-lg hover:bg-[#E07B39] hover:text-white transition"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-4 py-2 text-sm text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                  >
                    Remove
                  </button>
                </div>
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <FaSpinner className="text-white text-3xl animate-spin" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Password with Show/Hide */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E07B39] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p className={password?.length >= 6 ? 'text-green-500' : ''}>
                ✓ Minimum 6 characters
              </p>
              <p className={/[A-Z]/.test(password || '') ? 'text-green-500' : ''}>
                ✓ At least one uppercase letter
              </p>
              <p className={/[a-z]/.test(password || '') ? 'text-green-500' : ''}>
                ✓ At least one lowercase letter
              </p>
            </div>
          </div>

          {/* Confirm Password with Show/Hide */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E07B39] transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || imageUploading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-[#1A0F0A] text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <FaGoogle className="text-red-500" />
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#E07B39] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}