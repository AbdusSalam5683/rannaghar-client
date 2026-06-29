import { api } from './api';

export const paymentService = {
  // Create payment intent
  createIntent: async (amount, paymentType, recipeId = null) =>
    api.post('/payments/create-intent', { amount, paymentType, recipeId }),

  // Confirm payment
  confirm: async (paymentIntentId) =>
    api.post('/payments/confirm', { paymentIntentId }),

  // Get payment history
  getHistory: async () => api.get('/payments/history'),
};