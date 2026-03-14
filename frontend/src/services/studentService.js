import api from './api';

export const getAllStudents = (params) => api.get('/students', { params });
export const addStudent = (data) => api.post('/students/add', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const removeStudent = (id) => api.delete(`/students/${id}`);
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);
