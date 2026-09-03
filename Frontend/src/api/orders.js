import api from './client';

// Create new order
export const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

// Get all orders (admin)
export const getOrders = (params = {}) => {
  return api.get('/orders', { params });
};

// Get single order (admin)
export const getOrder = (id) => {
  return api.get(`/orders/${id}`);
};

// Update order status (admin)
export const updateOrderStatus = (id, status) => {
  return api.patch(`/orders/${id}/status`, { status });
};

// Get order statistics (admin)
export const getOrderStats = () => {
  return api.get('/orders/stats/overview');
};
