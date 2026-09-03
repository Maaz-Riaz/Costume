import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, selectedSize, 1);
    toast.success('Added to cart!');
    setShowSizeSelector(false);
  };

  const inStock = product.stock > 0;
  
  // Get price based on selected size or base price
  const getPrice = () => {
    if (product.sizePrices && product.sizePrices[selectedSize]) {
      return product.sizePrices[selectedSize];
    }
    return product.price;
  };

  return (
    <Link to={`/products/${product._id}`}>
      <div className="catalog-card card overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
        {/* Image Container */}
        <div className="relative bg-gray-200 h-48 overflow-hidden">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
          {product.isFeatured && (
            <div className="absolute top-2 right-2 bg-secondary text-white px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={14} fill="currentColor" />
              Featured
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <p className="text-white font-bold text-lg">Out of Stock</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs bg-primary bg-opacity-20 text-primary px-2 py-1 rounded">
              Age: {product.ageRange}
            </span>
            <span className="text-xs bg-secondary bg-opacity-20 text-secondary px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          <p className="text-2xl font-bold text-primary mb-4">${getPrice().toFixed(2)}</p>

          {/* Quick Add Button */}
          {inStock ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowSizeSelector(!showSizeSelector);
                }}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              
              {showSizeSelector && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-primary rounded-lg p-3 z-10 shadow-lg">
                  <p className="text-sm font-semibold mb-2">Select Size:</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-1 px-2 rounded text-sm font-medium transition ${
                          selectedSize === size
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full btn-primary text-sm py-1"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button disabled className="w-full py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed">
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
