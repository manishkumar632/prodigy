'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiFilter, FiX, FiStar, FiChevronDown } from 'react-icons/fi';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import toast from 'react-hot-toast';

// Dummy women's products data
const womenProducts = [
  {
    _id: 'w1',
    name: 'Floral Summer Dress',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'women',
    subcategory: 'dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral', 'Blue', 'Pink'],
    description: 'A lightweight summer dress with a beautiful floral pattern. Perfect for warm days and special occasions.',
    rating: 4.7,
    numReviews: 142,
    inStock: true
  },
  {
    _id: 'w2',
    name: 'High-Waisted Skinny Jeans',
    price: 69.99,
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'women',
    subcategory: 'jeans',
    sizes: ['24', '26', '28', '30', '32'],
    colors: ['Blue', 'Black', 'White'],
    description: 'Classic high-waisted skinny jeans with a comfortable stretch. Flattering fit for all body types.',
    rating: 4.5,
    numReviews: 118,
    inStock: true
  },
  {
    _id: 'w3',
    name: 'Silk Blouse',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'women',
    subcategory: 'blouses',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Cream'],
    description: 'Elegant silk blouse with a relaxed fit. Perfect for both office wear and special occasions.',
    rating: 4.6,
    numReviews: 89,
    inStock: true
  },
  {
    _id: 'w4',
    name: 'Knit Cardigan',
    price: 64.99,
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'women',
    subcategory: 'sweaters',
    sizes: ['S', 'M', 'L'],
    colors: ['Beige', 'Gray', 'Pink'],
    description: 'Cozy knit cardigan perfect for layering. Features a relaxed fit and premium yarn for ultimate comfort.',
    rating: 4.4,
    numReviews: 76,
    inStock: true
  },
  {
    _id: 'w5',
    name: 'Leather Ankle Boots',
    price: 119.99,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'women',
    subcategory: 'shoes',
    sizes: ['5', '6', '7', '8', '9', '10'],
    colors: ['Black', 'Brown', 'Tan'],
    description: 'Classic leather ankle boots with a comfortable heel. Versatile style that pairs well with any outfit.',
    rating: 4.8,
    numReviews: 94,
    inStock: true
  },
  {
    _id: 'w6',
    name: 'Pleated Midi Skirt',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'women',
    subcategory: 'skirts',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Burgundy'],
    description: 'Elegant pleated midi skirt with an elastic waistband. Perfect for both casual and formal occasions.',
    rating: 4.5,
    numReviews: 67,
    inStock: true
  },
  {
    _id: 'w7',
    name: 'Oversized Blazer',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1548575636-75a489c2a4cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'women',
    subcategory: 'blazers',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Beige', 'Gray'],
    description: 'Trendy oversized blazer with a modern cut. Perfect for creating a sophisticated yet relaxed look.',
    rating: 4.6,
    numReviews: 52,
    inStock: true
  },
  {
    _id: 'w8',
    name: 'Yoga Leggings',
    price: 44.99,
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
    category: 'women',
    subcategory: 'activewear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Blue', 'Purple'],
    description: 'High-waisted yoga leggings with a comfortable stretch. Features moisture-wicking fabric and a hidden pocket.',
    rating: 4.7,
    numReviews: 128,
    inStock: true
  }
];

// Subcategories for filtering
const subcategories = [
  { id: 'dresses', name: 'Dresses' },
  { id: 'jeans', name: 'Jeans' },
  { id: 'blouses', name: 'Blouses' },
  { id: 'sweaters', name: 'Sweaters' },
  { id: 'shoes', name: 'Shoes' },
  { id: 'skirts', name: 'Skirts' },
  { id: 'blazers', name: 'Blazers' },
  { id: 'activewear', name: 'Activewear' }
];

export default function WomenPage() {
  const [products, setProducts] = useState(womenProducts);
  const [filteredProducts, setFilteredProducts] = useState(womenProducts);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortOption, setSortOption] = useState('featured');
  const { addToCart } = useCart();
  const { addToFavorites, isFavorite, removeFromFavorites } = useFavorites();

  // Filter products based on selected filters
  useEffect(() => {
    let result = [...womenProducts];
    
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
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Women's Collection"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Women's Collection</h1>
            <p className="text-xl">Discover the latest trends in women's fashion</p>
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