import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer bg-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">🎭 CostumeMart</h3>
            <p className="text-gray-300">Making kids' costume shopping fun and easy!</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary transition">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-primary transition">Products</Link></li>
              <li><Link to="/cart" className="text-gray-300 hover:text-primary transition">Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="/products?category=Superhero" className="text-gray-300 hover:text-primary transition">Superhero</a></li>
              <li><a href="/products?category=Animal" className="text-gray-300 hover:text-primary transition">Animal</a></li>
              <li><a href="/products?category=Princess" className="text-gray-300 hover:text-primary transition">Princess</a></li>
              <li><a href="/products?category=Halloween" className="text-gray-300 hover:text-primary transition">Halloween</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-primary" />
                <span className="text-gray-300">info@costumemart.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-primary" />
                <span className="text-gray-300">1-800-COSTUMES</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <span className="text-gray-300">123 Fun Street, Joy City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-300">
            © 2024 CostumeMart. All rights reserved. | Made with 🎨 for fun!
          </p>
        </div>
      </div>
    </footer>
  );
}
