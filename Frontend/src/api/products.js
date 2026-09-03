import api from './client';

// Get all products
export const getProducts = (params = {}) => {
  return api.get('/products', { params });
};

// Get featured products
export const getFeaturedProducts = () => {
  return api.get('/products/featured');
};

// Get single product
export const getProduct = (id) => {
  return api.get(`/products/${id}`);
};

// Create product (admin)
export const createProduct = (formData) => {
  return api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Update product (admin)
export const updateProduct = (id, formData) => {
  return api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Delete product (admin)
export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

// Toggle product featured status
export const toggleFeatured = (id) => {
  return api.patch(`/products/${id}/toggle-featured`);
};
