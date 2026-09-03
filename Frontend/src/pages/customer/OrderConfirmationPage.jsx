import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Home, ShoppingCart } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();

  return (
    <div className="customer-page confirmation-page max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed! 🎉</h1>
      <p className="text-xl text-gray-600 mb-8">
        Thank you for your order! We're excited to prepare your costumes.
      </p>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">Order Reference Number</p>
          <p className="text-2xl font-bold text-primary break-all">{orderId}</p>
        </div>

        <div className="space-y-4 text-left mb-6">
          <h3 className="font-bold text-lg">What happens next?</h3>
          <ol className="space-y-3 ml-4">
            <li className="flex gap-3">
              <span className="text-primary font-bold min-w-fit">1.</span>
              <span className="text-gray-700">We've received your order and will begin processing it right away.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold min-w-fit">2.</span>
              <span className="text-gray-700">We'll send you an email confirmation with all your order details.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold min-w-fit">3.</span>
              <span className="text-gray-700">Your costumes will be carefully packaged and shipped to you.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold min-w-fit">4.</span>
              <span className="text-gray-700">You'll receive a tracking number once your order ships.</span>
            </li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> Save your order reference number for future inquiries.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/"
          className="btn-primary bg-primary text-white flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold hover:opacity-90"
        >
          <Home size={20} />
          Back to Home
        </Link>
        <Link
          to="/products"
          className="btn-secondary bg-secondary text-white flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold hover:opacity-90"
        >
          <ShoppingCart size={20} />
          Continue Shopping
        </Link>
      </div>

      <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-lg text-left">
        <h3 className="font-bold text-amber-900 mb-3">📧 Check Your Email</h3>
        <p className="text-amber-800 mb-3">
          We've sent a confirmation email with your order details, including:
        </p>
        <ul className="text-amber-800 space-y-1 ml-4">
          <li>• Order reference number</li>
          <li>• Detailed list of items</li>
          <li>• Shipping address</li>
          <li>• Order total</li>
        </ul>
        <p className="text-amber-800 text-sm mt-4">
          If you don't see the email in your inbox, please check your spam folder.
        </p>
      </div>
    </div>
  );
}
