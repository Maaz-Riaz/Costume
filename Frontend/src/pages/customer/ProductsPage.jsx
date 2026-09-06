import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/products';
import ProductCard from '../../components/ProductCard';
import { Loader, ChevronDown } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    ageRange: searchParams.get('ageRange') || '',
    search: searchParams.get('search') || ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Superhero', 'Animal', 'Princess', 'Halloween', 'Occupation', 'Other'];
  // const ageRanges = ['2-4', '4-6', '6-8', '8-10', '10-12', '12+'];
  // const priceRanges = [
  //   { label: 'Under $25', min: 0, max: 25 },
  //   { label: '$25 - $50', min: 25, max: 50 },
  //   { label: '$50 - $100', min: 50, max: 100 },
  //   { label: 'Over $100', min: 100, max: 999999 }
  // ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.priceMin) params.priceMin = filters.priceMin;
        if (filters.priceMax) params.priceMax = filters.priceMax;
        if (filters.ageRange) params.ageRange = filters.ageRange;
        if (filters.search) params.search = filters.search;

        const response = await getProducts(params);
        setProducts(response.data.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      priceMin: '',
      priceMax: '',
      ageRange: '',
      search: ''
    });
    setSearchParams({});
  };

  return (
    <div className="customer-page products-page max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Costumes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search costumes..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Age Range */}
             

              <button
                onClick={resetFilters}
                className="w-full py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
          >
            <ChevronDown size={20} />
            Filters
          </button>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader className="animate-spin" size={40} />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No costumes found. Try adjusting your filters!</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">Showing {products.length} costume{products.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
