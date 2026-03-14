import api from './api';

export const signup = (data) => api.post('/auth/signup', data);
export const verifyOtp = (data) => api.post('/auth/verify-otp', data);
export const resendOtp = (email) => api.post('/auth/resend-otp', { email });
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
