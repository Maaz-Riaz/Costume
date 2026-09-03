import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getItemCount } = useCartStore();
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <header className="site-header">
      <nav className="site-nav">
        {/* Logo */}
        <Link to="/" className="site-logo">
          <span className="logo-mark">✦</span> COSTUME<span>MART</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex site-links">
          <Link to="/" className="active">Home</Link>
          <Link to="/products">Costumes</Link>
          <Link to="/products?category=Superhero">Superheroes</Link>
          {isAuthenticated && (
            <Link to="/admin">Dashboard</Link>
          )}
          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                localStorage.removeItem('adminToken');
                localStorage.removeItem('admin');
              }}
              className="site-logout"
            >
              Logout
            </button>
          )}
          <Link to="/cart" className="cart-link relative" aria-label="Shopping cart">
            <ShoppingCart className="text-primary" size={24} />
            {getItemCount() > 0 && (
              <span className="cart-count absolute -top-2 -right-2">
                {getItemCount()}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="menu-button md:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mobile-menu">
          <div className="flex flex-col gap-4 p-4">
            <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-primary">Products</Link>
            {isAuthenticated && (
              <Link to="/admin" className="text-gray-700 hover:text-primary">Dashboard</Link>
            )}
            <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-primary">
              <ShoppingCart size={20} />
              Cart ({getItemCount()})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
