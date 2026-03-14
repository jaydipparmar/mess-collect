import api from './api';

// Contractor
export const createFee = (data) => api.post('/fees', data);
export const getFees = () => api.get('/fees');
export const updateFee = (id, data) => api.put(`/fees/${id}`, data);
export const deleteFee = (id) => api.delete(`/fees/${id}`);

// Student
export const getStudentFees = () => api.get('/fees/student-fees');
