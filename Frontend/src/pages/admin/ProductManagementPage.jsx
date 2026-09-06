import { useEffect, useState } from 'react';
import { getProducts, deleteProduct, toggleFeatured } from '../../api/products';
import { Loader, Plus, Edit2, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductFormModal from '../../components/ProductFormModal';

export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ limit: 100 });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await toggleFeatured(id);
      toast.success('Product featured status updated');
      fetchProducts();
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to update product');
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📦 Product Management</h1>
        <button
          onClick={handleAddProduct}
          className="btn-primary bg-primary text-white flex items-center gap-2 px-6 py-3 rounded-lg font-semibold hover:opacity-90"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="animate-spin" size={40} />
        </div>
      ) : products.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 text-lg mb-6">No products yet. Add your first costume!</p>
          <button
            onClick={handleAddProduct}
            className="btn-primary bg-primary text-white inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <img
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.ageRange}</p>
                    </td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4 font-semibold text-primary">Rs{product.price}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product._id)}
                        className={`p-2 rounded transition ${
                          product.isFeatured
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-400 hover:bg-yellow-100'
                        }`}
                        title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <Star size={18} fill={product.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
