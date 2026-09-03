import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import { getOrderStats } from '../../api/orders';
import { LogOut, Package, ShoppingCart, BarChart3, Menu, X } from 'lucide-react';
import ProductManagementPage from './ProductManagementPage';
import OrderManagementPage from './OrderManagementPage';

export default function AdminDashboard() {
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, totalRevenue: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getOrderStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark text-white transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-primary">🎭 CostumeMart</h2>
          <p className="text-gray-400 text-sm">Admin Panel</p>
        </div>

        <nav className="space-y-2 p-6">
          <NavLink
            to="/admin"
            icon={<BarChart3 size={20} />}
            label="Dashboard"
            onClick={() => setSidebarOpen(false)}
          />
          <NavLink
            to="/admin/products"
            icon={<Package size={20} />}
            label="Products"
            onClick={() => setSidebarOpen(false)}
          />
          <NavLink
            to="/admin/orders"
            icon={<ShoppingCart size={20} />}
            label="Orders"
            onClick={() => setSidebarOpen(false)}
          />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-md p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-primary"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-900">{admin?.email}</p>
              <p className="text-sm text-gray-600 capitalize">{admin?.role}</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardHome stats={stats} />} />
            <Route path="/products/*" element={<ProductManagementPage />} />
            <Route path="/orders/*" element={<OrderManagementPage />} />
          </Routes>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function NavLink({ to, icon, label, onClick }) {
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-300 hover:bg-gray-800'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function DashboardHome({ stats }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Products</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">📦</p>
            </div>
            <Package className="text-secondary opacity-20" size={40} />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Pending Orders</p>
              <p className="text-4xl font-bold text-primary mt-2">{stats.pendingOrders}</p>
            </div>
            <ShoppingCart className="text-primary opacity-20" size={40} />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
              <p className="text-4xl font-bold text-accent mt-2">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <BarChart3 className="text-accent opacity-20" size={40} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link to="/admin/products" className="card p-6 hover:shadow-lg transition cursor-pointer group">
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition">
            📦 Manage Products
          </h3>
          <p className="text-gray-600">Add, edit, or delete costumes in your inventory</p>
        </Link>

        <Link to="/admin/orders" className="card p-6 hover:shadow-lg transition cursor-pointer group">
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition">
            🛍️ Manage Orders
          </h3>
          <p className="text-gray-600">View and update customer orders</p>
        </Link>
      </div>
    </div>
  );
}
