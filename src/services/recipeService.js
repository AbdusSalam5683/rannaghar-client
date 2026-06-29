import { api } from './api';

export const recipeService = {
  // Get all recipes (with pagination & filtering)
  getAll: async (page = 1, limit = 10, category = '') => {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append('category', category);
    return api.get(`/recipes?${params}`);
  },

  // Get featured recipes
  getFeatured: async () => api.get('/recipes/featured'),

  // Get popular recipes
  getPopular: async () => api.get('/recipes/popular'),

  // Get single recipe
  getById: async (id) => api.get(`/recipes/${id}`),

  // Get user's recipes
  getMyRecipes: async () => api.get('/recipes/user/my-recipes'),

  // Create recipe (with image upload)
  create: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'ingredients' || key === 'instructions') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.upload('/recipes', formData);
  },

  // Update recipe
  update: async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'ingredients' || key === 'instructions') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.upload(`/recipes/${id}`, formData);
  },

  // Delete recipe
  delete: async (id) => api.delete(`/recipes/${id}`),

  // Like recipe
  like: async (id) => api.patch(`/recipes/${id}/like`),

  // Get categories
  getCategories: async () => api.get('/recipes/categories'),
};