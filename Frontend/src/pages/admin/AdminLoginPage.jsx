import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await adminLogin(email, password);

      if (response.data.success) {
        const { token, admin } = response.data;
        
        // Store in localStorage
        localStorage.setItem('adminToken', token);
        localStorage.setItem('admin', JSON.stringify(admin));

        // Update auth store
        setAuth(admin, token);

        toast.success('Login successful!');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🎭</h1>
          <h2 className="text-3xl font-bold text-gray-900">CostumeMart Admin</h2>
          <p className="text-gray-600 mt-2">Manage your costume store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="inline mr-2" size={18} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@costumemart.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Lock className="inline mr-2" size={18} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Email: admin@costumemart.com</p>
          <p>Password: (Set during setup)</p>
        </div>
      </div>
    </div>
  );
}
