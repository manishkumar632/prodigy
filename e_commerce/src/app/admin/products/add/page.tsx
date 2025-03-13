'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiSave, FiX, FiUpload, FiPlus, FiMinus, 
  FiDollarSign, FiTag, FiPackage, FiAlertCircle, FiCheck 
} from 'react-icons/fi';

export default function AddProduct() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    inStock: true,
    featured: false,
    sizes: {
      XS: false,
      S: false,
      M: false,
      L: false,
      XL: false,
      XXL: false,
    },
    colors: {
      Black: false,
      White: false,
      Gray: false,
      Red: false,
      Blue: false,
      Green: false,
      Yellow: false,
      Purple: false,
      Pink: false,
      Brown: false,
    },
    features: [''],
  });
  
  // Images state
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle size toggle
  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: !prev.sizes[size as keyof typeof prev.sizes],
      },
    }));
  };
  
  // Handle color toggle
  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [color]: !prev.colors[color as keyof typeof prev.colors],
      },
    }));
  };
  
  // Handle feature changes
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
  };
  
  // Add new feature field
  const addFeatureField = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };
  
  // Remove feature field
  const removeFeatureField = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Create preview URLs
      const newImagePreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...filesArray]);
      setImagePreviewUrls(prev => [...prev, ...newImagePreviewUrls]);
    }
  };
  
  // Remove image
  const removeImage = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Form validation
  const validateForm = () => {
    if (!formData.name) return 'Product name is required';
    if (!formData.description) return 'Product description is required';
    if (!formData.price) return 'Product price is required';
    if (!formData.category) return 'Product category is required';
    if (!formData.subcategory) return 'Product subcategory is required';
    
    const selectedSizes = Object.values(formData.sizes).filter(Boolean).length;
    if (selectedSizes === 0) return 'At least one size must be selected';
    
    const selectedColors = Object.values(formData.colors).filter(Boolean).length;
    if (selectedColors === 0) return 'At least one color must be selected';
    
    if (images.length === 0) return 'At least one product image is required';
    
    return '';
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create new product object
      const newProduct = {
        id: `p${Date.now()}`, // Generate unique ID
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price),
        inStock: formData.inStock,
        featured: formData.featured,
        description: formData.description,
        sizes: Object.entries(formData.sizes)
          .filter(([_, isSelected]) => isSelected)
          .map(([size]) => size),
        colors: Object.entries(formData.colors)
          .filter(([_, isSelected]) => isSelected)
          .map(([color]) => color),
        features: formData.features.filter(feature => feature.trim() !== ''),
        image: imagePreviewUrls[0] || 'https://via.placeholder.com/200', // Use first image or placeholder
      };

      // Store in localStorage
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const updatedProducts = [...existingProducts, newProduct];
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      // Show success message
      setSuccess(true);
      
      // Reset form after 2 seconds and redirect
      setTimeout(() => {
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          subcategory: '',
          inStock: true,
          featured: false,
          sizes: {
            XS: false,
            S: false,
            M: false,
            L: false,
            XL: false,
            XXL: false,
          },
          colors: {
            Black: false,
            White: false,
            Gray: false,
            Red: false,
            Blue: false,
            Green: false,
            Yellow: false,
            Purple: false,
            Pink: false,
            Brown: false,
          },
          features: [''],
        });
        
        // Reset images
        imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
        setImages([]);
        setImagePreviewUrls([]);
        
        // Reset success state
        setSuccess(false);
        
        // Redirect to products page
        router.push('/admin/products');
      }, 2000);
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-md p-6 md:p-8"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Fill in the details to add a new product to your store</p>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded"
          >
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded"
          >
            <div className="flex items-center">
              <FiCheck className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">Product added successfully!</p>
            </div>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Information */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Basic Information
              </h2>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g. Classic Oxford Shirt"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="29.99"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Describe your product in detail..."
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Category</option>
                <option value="men">Men's Clothing</option>
                <option value="women">Women's Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="footwear">Footwear</option>
              </select>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Subcategory</option>
                {formData.category === 'men' && (
                  <>
                    <option value="shirts">Shirts</option>
                    <option value="t-shirts">T-Shirts</option>
                    <option value="pants">Pants</option>
                    <option value="jeans">Jeans</option>
                    <option value="jackets">Jackets</option>
                    <option value="sweaters">Sweaters</option>
                  </>
                )}
                {formData.category === 'women' && (
                  <>
                    <option value="dresses">Dresses</option>
                    <option value="tops">Tops</option>
                    <option value="skirts">Skirts</option>
                    <option value="pants">Pants</option>
                    <option value="jeans">Jeans</option>
                    <option value="jackets">Jackets</option>
                    <option value="sweaters">Sweaters</option>
                  </>
                )}
                {formData.category === 'accessories' && (
                  <>
                    <option value="bags">Bags</option>
                    <option value="belts">Belts</option>
                    <option value="hats">Hats</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="watches">Watches</option>
                    <option value="sunglasses">Sunglasses</option>
                  </>
                )}
                {formData.category === 'footwear' && (
                  <>
                    <option value="sneakers">Sneakers</option>
                    <option value="boots">Boots</option>
                    <option value="sandals">Sandals</option>
                    <option value="formal">Formal Shoes</option>
                    <option value="heels">Heels</option>
                  </>
                )}
              </select>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                  In Stock
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured Product
                </label>
              </div>
            </motion.div>
            
            {/* Sizes and Colors */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Sizes and Colors
              </h2>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(formData.sizes).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      formData.sizes[size as keyof typeof formData.sizes]
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Colors <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(formData.colors).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorToggle(color)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      formData.colors[color as keyof typeof formData.colors]
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </motion.div>
            
            {/* Product Features */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Product Features
              </h2>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={`Feature ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeatureField(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <FiMinus className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeatureField}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                  Add Feature
                </button>
              </div>
            </motion.div>
            
            {/* Product Images */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Product Images <span className="text-red-500">*</span>
              </h2>
              <div className="mt-2">
                <div className="flex flex-wrap gap-4 mb-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-indigo-500 hover:bg-gray-50"
                  >
                    <FiUpload className="h-6 w-6 text-gray-400" />
                    <span className="mt-1 text-xs text-gray-500">Add Image</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Upload multiple product images. First image will be used as the main product image.
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2 -ml-1 h-5 w-5" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 