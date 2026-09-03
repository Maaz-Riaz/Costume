import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { createOrder } from '../../api/orders';
import toast from 'react-hot-toast';
import { useState } from 'react';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\d\-\+\(\)\s]{10,}$/, 'Invalid phone number'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code must be at least 5 characters'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional()
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      notes: ''
    }
  });

  const total = getTotal();
  const taxAmount = total * 0.08;
  const finalTotal = total + taxAmount;

  const onSubmit = async (formData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: finalTotal,
        notes: formData.notes
      };

      const response = await createOrder(orderData);

      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/order-confirmation/${response.data.data.orderId}`);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="customer-page checkout-page max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Checkout</h1>
        <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="btn-primary inline-block"
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="customer-page checkout-page max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">📝 Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Customer Info */}
            <h2 className="text-2xl font-bold mb-6">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <input
                  {...register('customerName')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <input
                  {...register('phone')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(123) 456-7890"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Shipping Address */}
            <h2 className="text-2xl font-bold mb-6 mt-8">Shipping Address</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Street Address *</label>
                <input
                  {...register('street')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Main St"
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">City *</label>
                  <input
                    {...register('city')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Springfield"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">State *</label>
                  <input
                    {...register('state')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="IL"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">ZIP Code *</label>
                <input
                  {...register('zip')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${
                    errors.zip ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="62701"
                />
                {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip.message}</p>}
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-sm font-semibold mb-2">Special Instructions (Optional)</label>
              <textarea
                {...register('notes')}
                rows={3}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary`}
                placeholder="e.g., Gift wrap please, rush delivery needed, etc."
              />
              {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>}
            </div>
          </div>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">{item.size} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span className="font-semibold">${taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-bold mb-6">
              <span>Total:</span>
              <span className="text-primary">${finalTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => document.querySelector('form')?.requestSubmit()}
              disabled={isSubmitting}
              className="w-full btn-primary bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="w-full mt-3 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
