import api from './api';

export const createOrder = (paymentId) => api.post('/payments/create-order', { paymentId });
export const verifyPayment = (data) => api.post('/payments/verify', data);
export const getMyPayments = () => api.get('/payments/my-payments');
export const getAllPayments = () => api.get('/payments/all');
export const getAnalytics = () => api.get('/payments/analytics');
