import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [isClearing, setIsClearing] = useState(false);

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="customer-page cart-page max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🛒 Your Cart</h1>
          <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
          <Link to="/products" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-page cart-page max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">🛒 Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="p-4 text-left">Product</th>
                    <th className="p-4 text-left">Size</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Quantity</th>
                    <th className="p-4 text-left">Total</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={`${item.productId}-${item.size}`} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex gap-4 items-start">
                          <img
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">{item.size}</td>
                      <td className="p-4">${item.price}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 w-fit">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <Link to="/products" className="text-primary hover:underline font-medium">
                Continue Shopping
              </Link>
              <button
                onClick={() => {
                  if (isClearing) {
                    clearCart();
                    setIsClearing(false);
                  } else {
                    setIsClearing(true);
                    setTimeout(() => setIsClearing(false), 3000);
                  }
                }}
                className="text-red-600 hover:text-red-800 font-medium transition"
              >
                {isClearing ? 'Click again to confirm' : 'Clear Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="font-semibold">${(total * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-bold mb-6">
              <span>Total:</span>
              <span className="text-primary">${(total * 1.08).toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="w-full block text-center btn-primary bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
            >
              Proceed to Checkout
            </Link>

            <p className="text-center text-sm text-gray-600 mt-4">
              You have <span className="font-bold">{items.length}</span> item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
