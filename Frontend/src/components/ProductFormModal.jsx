import { useState, useRef } from 'react';
import { createProduct, updateProduct } from '../api/products';
import toast from 'react-hot-toast';
import { X, Upload } from 'lucide-react';

const categories = ['Superhero', 'Animal', 'Princess', 'Halloween', 'Occupation', 'Other'];
const ageRanges = ['2-4', '4-6', '6-8', '8-10', '10-12', '12+'];
const defaultSizes = ['XS', 'S', 'M', 'L', 'XL'];

export default function ProductFormModal({ product, onClose }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    sizePrices: product?.sizePrices ? Object.fromEntries(product.sizePrices) : {},
    useSizePrices: product?.sizePrices && Object.keys(product.sizePrices).length > 0 ? true : false,
    category: product?.category || 'Superhero',
    ageRange: product?.ageRange || '6-8',
    sizes: product?.sizes || defaultSizes,
    stock: product?.stock || '',
    isFeatured: product?.isFeatured || false
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(product?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizePriceChange = (size, value) => {
    setFormData(prev => ({
      ...prev,
      sizePrices: {
        ...prev.sizePrices,
        [size]: value ? parseFloat(value) : 0
      }
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files) || [];
    setImages(prev => [...prev, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    if (index >= (product?.images?.length || 0)) {
      setImages(prev => prev.filter((_, i) => i !== index - (product?.images?.length || 0)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!product && (previewUrls.length === 0 || images.length === 0)) {
      toast.error('Please upload at least one image for new products');
      return;
    }

    try {
      setIsSubmitting(true);

      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('price', formData.price);
      submitFormData.append('category', formData.category);
      submitFormData.append('ageRange', formData.ageRange);
      submitFormData.append('sizes', JSON.stringify(formData.sizes));
      submitFormData.append('stock', formData.stock);
      submitFormData.append('isFeatured', String(formData.isFeatured));
      
      // Add size prices if enabled
      if (formData.useSizePrices && Object.keys(formData.sizePrices).length > 0) {
        submitFormData.append('sizePrices', JSON.stringify(formData.sizePrices));
      }

      // Add only new image files
      images.forEach(file => {
        submitFormData.append('images', file);
      });

      let response;
      if (product) {
        response = await updateProduct(product._id, submitFormData);
        toast.success('Product updated successfully');
      } else {
        response = await createProduct(submitFormData);
        toast.success('Product created successfully');
      }

      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Name & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g., Super Batman Costume"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Base Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="29.99"
              />
            </div>
          </div>

          {/* Size-Based Pricing Toggle */}
          <label className="flex items-center gap-2 cursor-pointer p-4 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              name="useSizePrices"
              checked={formData.useSizePrices}
              onChange={handleInputChange}
              className="w-4 h-4 rounded"
            />
            <span className="font-medium text-blue-900">Use different prices for each size</span>
          </label>

          {/* Size Prices Input */}
          {formData.useSizePrices && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-semibold mb-3 text-gray-700">Price per Size</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.sizes.map(size => (
                  <div key={size}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{size}</label>
                    <input
                      type="number"
                      value={formData.sizePrices[size] || ''}
                      onChange={(e) => handleSizePriceChange(size, e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                      placeholder={`$`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Describe the costume..."
            />
          </div>

          {/* Category & Age Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Age Range *</label>
              <select
                name="ageRange"
                value={formData.ageRange}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                {ageRanges.map(age => (
                  <option key={age} value={age}>{age} years</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-semibold mb-2">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              placeholder="0"
            />
          </div>

          {/* Featured Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span className="font-medium">Featured on Home Page</span>
          </label>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold mb-3">Product Images</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-primary rounded-lg p-8 text-center hover:bg-primary hover:bg-opacity-10 transition cursor-pointer"
            >
              <Upload className="mx-auto mb-2 text-primary" size={32} />
              <p className="font-semibold text-primary">Click to upload images</p>
              <p className="text-sm text-gray-600">PNG, JPG, GIF or WebP (max 5MB each)</p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={typeof url === 'string' ? url : url} alt={`Preview ${idx}`} className="w-full h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 btn-primary bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
