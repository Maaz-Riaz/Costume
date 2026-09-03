import { X, Printer } from 'lucide-react';

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Shipped': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
};

export default function OrderDetailModal({ order, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
              title="Print"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Status and ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="font-mono text-lg font-bold">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="font-bold text-lg mb-3 border-b border-gray-200 pb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{order.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-bold text-lg mb-3 border-b border-gray-200 pb-2">Shipping Address</h3>
            <p className="font-medium">{order.shippingAddress.street}</p>
            <p className="font-medium">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
          </div>

          {/* Items Ordered */}
          <div>
            <h3 className="font-bold text-lg mb-3 border-b border-gray-200 pb-2">Items Ordered</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div>
              <h3 className="font-bold text-lg mb-3 border-b border-gray-200 pb-2">Special Instructions</h3>
              <p className="text-gray-700 bg-blue-50 p-3 rounded border border-blue-200">{order.notes}</p>
            </div>
          )}

          {/* Total */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary text-2xl">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
