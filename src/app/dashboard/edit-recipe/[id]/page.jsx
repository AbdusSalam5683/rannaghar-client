'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipeSchema } from '@/utils/validators';
import { toast } from 'react-hot-toast';
import { recipeService } from '@/services/recipeService';
import { uploadImageToImgbb } from '@/utils/uploadImage';
import { FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import Loader from '@/components/shared/Loader';

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      ingredients: [''],
      instructions: [''],
    },
  });

  const { fields: ingredientFields, append: addIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const { fields: instructionFields, append: addInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions',
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getById(id);
        const recipe = data.data;
        setCurrentImage(recipe.recipeImage);

        setValue('recipeName', recipe.recipeName);
        setValue('category', recipe.category);
        setValue('cuisineType', recipe.cuisineType);
        setValue('difficultyLevel', recipe.difficultyLevel);
        setValue('preparationTime', recipe.preparationTime);
        setValue('ingredients', recipe.ingredients || ['']);
        setValue('instructions', recipe.instructions || ['']);
      } catch (error) {
        toast.error('Failed to load recipe');
        router.push('/dashboard/my-recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, setValue, router]);

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
    setSubmitting(true);
    try {
      let imageUrl = currentImage;

      if (imageFile) {
        const uploadedUrl = await uploadImageToImgbb(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toast.error('Image upload failed');
          return;
        }
      }

      const recipeData = {
        ...data,
        recipeImage: imageUrl,
        ingredients: data.ingredients.filter((i) => i.trim()),
        instructions: data.instructions.filter((i) => i.trim()),
      };

      await recipeService.update(id, recipeData);
      toast.success('Recipe updated successfully!');
      router.push('/dashboard/my-recipes');
    } catch (error) {
      toast.error(error.message || 'Failed to update recipe');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 min-h-screen py-8">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-2">
          Edit Recipe
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Update your recipe details
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-[#1A0F0A] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-[#2C1608] space-y-6">
          {/* Same form fields as Add Recipe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipe Name
            </label>
            <input
              type="text"
              {...register('recipeName')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] text-[#2C1A0E] dark:text-[#F5D9B0] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
              placeholder="Enter recipe name"
            />
            {errors.recipeName && (
              <p className="text-red-500 text-sm mt-1">{errors.recipeName.message}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipe Image
            </label>
            <div className="flex flex-col items-start gap-4">
              <div className="relative h-48 w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 dark:border-[#2C1608]">
                <Image
                  src={imagePreview || currentImage}
                  alt="Recipe"
                  fill
                  className="object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#E07B39] file:text-white
                  hover:file:bg-[#c96a2e]"
              />
            </div>
          </div>

          {/* Category & Cuisine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] text-[#2C1A0E] dark:text-[#F5D9B0] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Desserts">Desserts</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Seafood">Seafood</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cuisine Type
              </label>
              <select
                {...register('cuisineType')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] text-[#2C1A0E] dark:text-[#F5D9B0] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
              >
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Mexican">Mexican</option>
                <option value="Thai">Thai</option>
                <option value="Japanese">Japanese</option>
                <option value="American">American</option>
                <option value="Other">Other</option>
              </select>
              {errors.cuisineType && (
                <p className="text-red-500 text-sm mt-1">{errors.cuisineType.message}</p>
              )}
            </div>
          </div>

          {/* Difficulty & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty Level
              </label>
              <select
                {...register('difficultyLevel')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] text-[#2C1A0E] dark:text-[#F5D9B0] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              {errors.difficultyLevel && (
                <p className="text-red-500 text-sm mt-1">{errors.difficultyLevel.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preparation Time
              </label>
              <input
                type="text"
                {...register('preparationTime')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] text-[#2C1A0E] dark:text-[#F5D9B0] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
                placeholder="e.g., 30 minutes"
              />
              {errors.preparationTime && (
                <p className="text-red-500 text-sm mt-1">{errors.preparationTime.message}</p>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ingredients
            </label>
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`ingredients.${index}`)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] text-[#2C1A0E] dark:text-[#F5D9B0] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition"
                  placeholder={`Ingredient ${index + 1}`}
                />
                {ingredientFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-3 py-2 text-red-500 hover:text-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addIngredient('')}
              className="text-[#E07B39] hover:text-[#c96a2e] transition text-sm font-medium flex items-center gap-1"
            >
              <FaPlus size={12} /> Add ingredient
            </button>
            {errors.ingredients && (
              <p className="text-red-500 text-sm mt-1">{errors.ingredients.message}</p>
            )}
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Instructions
            </label>
            {instructionFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <textarea
                  {...register(`instructions.${index}`)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0505] text-[#2C1A0E] dark:text-[#F5D9B0] focus:ring-2 focus:ring-[#E07B39] focus:border-transparent transition min-h-[60px]"
                  placeholder={`Step ${index + 1}`}
                />
                {instructionFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="px-3 py-2 text-red-500 hover:text-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addInstruction('')}
              className="text-[#E07B39] hover:text-[#c96a2e] transition text-sm font-medium flex items-center gap-1"
            >
              <FaPlus size={12} /> Add step
            </button>
            {errors.instructions && (
              <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Updating...
              </>
            ) : (
              'Update Recipe'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}