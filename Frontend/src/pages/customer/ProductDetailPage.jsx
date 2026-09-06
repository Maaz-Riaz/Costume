import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../api/products';
import { useCartStore } from '../../store/cartStore';
import { Loader, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(id);
        setProduct(response.data.data);
        setSelectedSize(response.data.data?.sizes?.[0] || '');
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addItem(product, selectedSize, quantity);
    toast.success('Added to cart!');
    setTimeout(() => navigate('/cart'), 500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-600">Product not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 btn-primary">Go Back</button>
      </div>
    );
  }

  const inStock = product.stock > 0;

  // Get price based on selected size or base price
  const getPrice = () => {
    if (product.sizePrices && selectedSize && product.sizePrices[selectedSize]) {
      return product.sizePrices[selectedSize];
    }
    return product.price;
  };

  return (
    <div className="customer-page detail-page detail-reveal max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary hover:underline mb-8"
      >
        <ChevronLeft size={20} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative bg-gray-200 h-96 rounded-lg overflow-hidden mb-4 gallery-frame">
            <img
              src={product.images?.[currentImageIndex] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isFeatured && (
              <div className="absolute top-4 right-4 bg-secondary text-white px-4 py-2 rounded-full font-semibold">
                ⭐ Featured
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2 flex-1 overflow-x-auto">
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 rounded overflow-hidden flex-shrink-0 transition ${
                      idx === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-60'
                    }`}
                  >
                    <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>

          <div className="flex gap-4 mb-4">
            
            <span className="bg-secondary bg-opacity-20 text-secondary px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>

          <p className="text-gray-600 text-lg mb-6">{product.description}</p>

          <div className="mb-6">
            <p className="text-4xl font-bold text-primary">PKR {getPrice().toFixed(2)}</p>
           
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Size:</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedSize === size
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Quantity:</h3>
            <div className="flex items-center gap-4 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                −
              </button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition ${
              inStock
                ? 'btn-primary bg-primary text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={24} />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
