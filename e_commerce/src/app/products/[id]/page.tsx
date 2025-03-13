'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiChevronLeft, FiChevronRight, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import toast from 'react-hot-toast';

// Combined product data from both men's and women's collections
const allProducts = [
  // Men's products
  {
    _id: 'm1',
    name: 'Classic Oxford Shirt',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1563630423918-b58f07336ac9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    category: 'men',
    subcategory: 'shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Black'],
    description: 'A timeless Oxford shirt made from premium cotton. Features a button-down collar and a regular fit that\'s perfect for both casual and formal occasions.',
    rating: 4.8,
    numReviews: 124,
    inStock: true,
    features: [
      'Premium 100% cotton fabric',
      'Button-down collar',
      'Regular fit',
      'Machine washable',
      'Imported'
    ],
    relatedProducts: ['m2', 'm3', 'm7']
  },
  {
    _id: 'm2',
    name: 'Slim Fit Chinos',
    price: 59.99,
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    category: 'men',
    subcategory: 'pants',
    sizes: ['30x32', '32x32', '34x32', '36x32', '38x32'],
    colors: ['Khaki', 'Navy', 'Olive'],
    description: 'Modern slim fit chinos crafted from stretch cotton twill. These versatile pants offer both style and comfort for everyday wear.',
    rating: 4.6,
    numReviews: 98,
    inStock: true,
    features: [
      '98% cotton, 2% elastane',
      'Slim fit',
      'Flat front',
      'Hook and bar closure with zip fly',
      'Side slant pockets and back welt pockets'
    ],
    relatedProducts: ['m1', 'm4', 'm6']
  },
  // Women's products
  {
    _id: 'w1',
    name: 'Floral Summer Dress',
    price: 59.99,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1566174053879-31528523f8c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    category: 'women',
    subcategory: 'dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral', 'Blue', 'Pink'],
    description: 'A lightweight summer dress with a beautiful floral pattern. Perfect for warm days and special occasions.',
    rating: 4.7,
    numReviews: 142,
    inStock: true,
    features: [
      '100% rayon fabric',
      'V-neckline',
      'Short flutter sleeves',
      'Tiered skirt',
      'Machine washable'
    ],
    relatedProducts: ['w3', 'w6', 'w7']
  },
  {
    _id: 'w2',
    name: 'High-Waisted Skinny Jeans',
    price: 69.99,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    category: 'women',
    subcategory: 'jeans',
    sizes: ['24', '26', '28', '30', '32'],
    colors: ['Blue', 'Black', 'White'],
    description: 'Classic high-waisted skinny jeans with a comfortable stretch. Flattering fit for all body types.',
    rating: 4.5,
    numReviews: 118,
    inStock: true,
    features: [
      '92% cotton, 6% polyester, 2% elastane',
      'High-rise waist',
      'Skinny fit through hip and thigh',
      'Five-pocket styling',
      'Machine washable'
    ],
    relatedProducts: ['w1', 'w3', 'w6']
  }
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  const { addToCart } = useCart();
  const { addToFavorites, isFavorite, removeFromFavorites } = useFavorites();

  // Find product by ID
  useEffect(() => {
    const foundProduct = allProducts.find(p => p._id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes[0]);
      setSelectedColor(foundProduct.colors[0]);
      
      // Find related products
      if (foundProduct.relatedProducts && foundProduct.relatedProducts.length > 0) {
        const related = allProducts.filter(p => 
          foundProduct.relatedProducts.includes(p._id)
        );
        setRelatedProducts(related);
      }
    }
    setLoading(false);
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    });
    
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    
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

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">Sorry, the product you are looking for does not exist.</p>
        <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${product.category}`} className="hover:text-indigo-600 transition-colors capitalize">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${product.category}?subcategory=${product.subcategory}`} className="hover:text-indigo-600 transition-colors capitalize">
              {product.subcategory}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Back Button - Mobile */}
      <div className="md:hidden container mx-auto px-4 py-4">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden h-96 md:h-[500px]">
              {product.images.length > 0 && (
                <>
                  <Image
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-4"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 text-gray-800 hover:bg-opacity-100 transition-all"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 text-gray-800 hover:bg-opacity-100 transition-all"
                        aria-label="Next image"
                      >
                        <FiChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-indigo-600' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">{product.rating} ({product.numReviews} reviews)</span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <p className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Free shipping on orders over $50</p>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                <div className="flex space-x-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 border rounded-md ${
                        selectedColor === color
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-500">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 border rounded-md ${
                        selectedSize === size
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center border border-gray-300 rounded-md w-32">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1 text-gray-600 hover:text-indigo-600"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center border-0 focus:ring-0"
                  />
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3 py-1 text-gray-600 hover:text-indigo-600"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Add to Cart & Favorite Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <FiShoppingCart className="mr-2" /> Add to Cart
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center justify-center py-3 px-6 rounded-md border ${
                    isFavorite(product._id)
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <FiHeart className={`mr-2 ${isFavorite(product._id) ? 'fill-current' : ''}`} />
                  {isFavorite(product._id) ? 'Saved' : 'Save'}
                </button>
              </div>
              
              {/* Features */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Features</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden group"
                >
                  <Link href={`/products/${relatedProduct._id}`}>
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/products/${relatedProduct._id}`}>
                      <h3 className="text-lg font-medium mb-1 hover:text-indigo-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <p className="text-indigo-600 font-bold">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 