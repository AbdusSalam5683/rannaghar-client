import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter'),
    confirmPassword: z.string(),
    image: z.string().url('Invalid image URL').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const recipeSchema = z.object({
  recipeName: z.string().min(2, 'Recipe name is required'),
  category: z.string().min(1, 'Category is required'),
  cuisineType: z.string().min(1, 'Cuisine type is required'),
  difficultyLevel: z.string().min(1, 'Difficulty level is required'),
  preparationTime: z.string().min(1, 'Preparation time is required'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.string()).min(1, 'At least one instruction is required'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  image: z.string().url('Invalid image URL').optional(),
});