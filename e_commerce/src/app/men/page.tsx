'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiFilter, FiX, FiStar, FiChevronDown } from 'react-icons/fi';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import toast from 'react-hot-toast';

// Dummy men's products data
const menProducts = [
  {
    _id: 'm1',
    name: 'Classic Fit Oxford Shirt',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1598032895397-b9472444bf93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'men',
    subcategory: 'shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Black'],
    description: 'A timeless Oxford shirt perfect for any occasion. Made from premium cotton for comfort and durability.',
    rating: 4.5,
    numReviews: 128,
    inStock: true
  },
  {
    _id: 'm2',
    name: 'Slim Fit Chino Pants',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'men',
    subcategory: 'pants',
    sizes: ['30x32', '32x32', '34x32', '36x32'],
    colors: ['Khaki', 'Navy', 'Olive'],
    description: 'Modern slim fit chinos with a comfortable stretch. Perfect for both casual and semi-formal occasions.',
    rating: 4.3,
    numReviews: 95,
    inStock: true
  },
  {
    _id: 'm3',
    name: 'Premium Denim Jacket',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'men',
    subcategory: 'jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Black'],
    description: 'A classic denim jacket with a modern fit. Made from high-quality denim that gets better with age.',
    rating: 4.7,
    numReviews: 72,
    inStock: true
  },
  {
    _id: 'm4',
    name: 'Merino Wool Sweater',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'men',
    subcategory: 'sweaters',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Navy', 'Burgundy'],
    description: 'Luxurious Merino wool sweater that provides warmth without bulk. Perfect for layering in colder weather.',
    rating: 4.6,
    numReviews: 64,
    inStock: true
  },
  {
    _id: 'm5',
    name: 'Athletic Performance T-Shirt',
    price: 34.99,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'men',
    subcategory: 't-shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Blue', 'Red'],
    description: 'Moisture-wicking performance t-shirt perfect for workouts or casual wear. Features anti-odor technology.',
    rating: 4.4,
    numReviews: 112,
    inStock: true
  },
  {
    _id: 'm6',
    name: 'Leather Chelsea Boots',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'men',
    subcategory: 'shoes',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Brown', 'Black'],
    description: 'Classic Chelsea boots made from genuine leather. Features elastic side panels and a comfortable insole.',
    rating: 4.8,
    numReviews: 56,
    inStock: true
  },
  {
    _id: 'm7',
    name: 'Tailored Fit Blazer',
    price: 149.99,
    images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'men',
    subcategory: 'blazers',
    sizes: ['38R', '40R', '42R', '44R'],
    colors: ['Navy', 'Charcoal', 'Black'],
    description: 'A versatile tailored blazer that transitions seamlessly from office to evening. Features a modern cut and premium fabric.',
    rating: 4.5,
    numReviews: 48,
    inStock: true
  },
  {
    _id: 'm8',
    name: 'Casual Hooded Sweatshirt',
    price: 54.99,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'men',
    subcategory: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Black', 'Navy', 'Green'],
    description: 'Comfortable cotton-blend hoodie perfect for casual days. Features a kangaroo pocket and adjustable drawstring hood.',
    rating: 4.2,
    numReviews: 87,
    inStock: true
  }
];

// Subcategories for filtering
const subcategories = [
  { id: 'shirts', name: 'Shirts' },
  { id: 'pants', name: 'Pants' },
  { id: 'jackets', name: 'Jackets' },
  { id: 'sweaters', name: 'Sweaters' },
  { id: 't-shirts', name: 'T-Shirts' },
  { id: 'shoes', name: 'Shoes' },
  { id: 'blazers', name: 'Blazers' },
  { id: 'hoodies', name: 'Hoodies' }
];

export default function MenPage() {
  const [products, setProducts] = useState(menProducts);
  const [filteredProducts, setFilteredProducts] = useState(menProducts);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortOption, setSortOption] = useState('featured');
  const { addToCart } = useCart();
  const { addToFavorites, isFavorite, removeFromFavorites } = useFavorites();

  // Filter products based on selected filters
  useEffect(() => {
    let result = [...menProducts];
    
    // Filter by subcategory
    if (selectedSubcategories.length > 0) {
      result = result.filter(product => selectedSubcategories.includes(product.subcategory));
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Sort products
    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'featured'
        // Keep original order
        break;
    }
    
    setFilteredProducts(result);
  }, [selectedSubcategories, priceRange, sortOption]);

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategory)
        ? prev.filter(sc => sc !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: product.sizes[0], // Default to first size
      color: product.colors[0], // Default to first color
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleFavorite = (product: any) => {
    if (isFavorite(product._id)) {
      removeFromFavorites(product._id);
      toast.success(`${product.name} removed from favorites!`);
    } else {
      addToFavorites({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
      });
      toast.success(`${product.name} added to favorites!`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 bg-gray-900 text-white">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ 
            scale: 1,
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 1,
            y: {
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut"
            }
          }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Men's Collection"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Men's Collection</h1>
            <p className="text-xl">Discover the latest trends in men's fashion</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden md:block w-64 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-lg font-bold mb-4">Filters</h2>
            
            {/* Subcategory Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Category</h3>
              <div className="space-y-2">
                {subcategories.map(subcategory => (
                  <div key={subcategory.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`desktop-${subcategory.id}`}
                      checked={selectedSubcategories.includes(subcategory.id)}
                      onChange={() => toggleSubcategory(subcategory.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`desktop-${subcategory.id}`} className="ml-2 text-sm text-gray-700">
                      {subcategory.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSelectedSubcategories([]);
                setPriceRange([0, 200]);
              }}
              className="w-full py-2 px-4 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FiFilter className="mr-2" /> Filter & Sort
              </button>
            </div>

            {/* Sort Options - Desktop */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-gray-600">{filteredProducts.length} products</p>
              <div className="flex items-center">
                <span className="mr-2 text-gray-700">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">No products match your filters. Try adjusting your criteria.</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-md overflow-hidden group"
                  >
                    <Link href={`/products/${product._id}`}>
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link href={`/products/${product._id}`}>
                        <h3 className="text-lg font-medium mb-1 hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating) ? 'fill-current' : ''
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({product.numReviews})</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{product.subcategory}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-indigo-600 font-bold">${product.price.toFixed(2)}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleFavorite(product)}
                            className={`p-2 rounded-full ${
                              isFavorite(product._id)
                                ? 'text-red-500 bg-red-50'
                                : 'text-gray-400 bg-gray-100 hover:text-red-500'
                            } transition-colors`}
                            aria-label="Add to favorites"
                          >
                            <FiHeart className={`h-5 w-5 ${isFavorite(product._id) ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                            aria-label="Add to cart"
                          >
                            <FiShoppingCart className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-6 border-b">
                  <h2 className="text-lg font-bold">Filters & Sort</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                <div className="overflow-y-auto flex-1 px-4 py-6">
                  {/* Sort Options - Mobile */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Sort by</h3>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                  
                  {/* Subcategory Filter - Mobile */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Category</h3>
                    <div className="space-y-2">
                      {subcategories.map(subcategory => (
                        <div key={subcategory.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mobile-${subcategory.id}`}
                            checked={selectedSubcategories.includes(subcategory.id)}
                            onChange={() => toggleSubcategory(subcategory.id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`mobile-${subcategory.id}`} className="ml-2 text-sm text-gray-700">
                            {subcategory.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range Filter - Mobile */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-6">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedSubcategories([]);
                        setPriceRange([0, 200]);
                      }}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md text-white hover:bg-indigo-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 