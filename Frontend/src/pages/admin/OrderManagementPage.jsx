import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, getOrder } from '../../api/orders';
import { Loader, Eye, CheckCircle, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import OrderDetailModal from '../../components/OrderDetailModal';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Shipped': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

const statusOptions = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await getOrders(params);
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = async (order) => {
    try {
      const response = await getOrder(order._id);
      setSelectedOrder(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🛍️ Order Management</h1>

        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">All Orders</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="animate-spin" size={40} />
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                    <td className="p-4 font-medium">{order.customerName}</td>
                    <td className="p-4 text-sm">{order.email}</td>
                    <td className="p-4 font-semibold text-primary">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-none cursor-pointer ${statusColors[order.status]}`}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
