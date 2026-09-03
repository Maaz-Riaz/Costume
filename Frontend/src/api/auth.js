import api from './client';

// Admin login
export const adminLogin = (email, password) => {
  return api.post('/admin/login', { email, password });
};

// Get current admin
export const getMe = () => {
  return api.get('/admin/me');
};

// Register admin
export const adminRegister = (email, password, role = 'admin') => {
  return api.post('/admin/register', { email, password, role });
};
