import { api } from './api';

export const favoriteService = {
  // Get user's favorites
  getMyFavorites: async () => api.get('/favorites'),

  // Add to favorites
  add: async (recipeId) => api.post('/favorites', { recipeId }),

  // Remove from favorites
  remove: async (recipeId) => api.delete(`/favorites/${recipeId}`),

  // Check if recipe is favorite
  check: async (recipeId) => api.get(`/favorites/check/${recipeId}`),
};