'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useFavorites } from '@/providers/FavoritesProvider';
import { useCart } from '@/providers/CartProvider';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();
  
  const handleRemoveFromFavorites = (productId: string) => {
    removeFromFavorites(productId);
    toast.success('Removed from favorites');
  };
  
  const handleAddToCart = (product: any) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };
  
  const handleClearAll = () => {
    clearFavorites();
    toast.success('All items removed from favorites');
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

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-red-500 mb-4">
              <FiHeart className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your favorites list is empty</h1>
            <p className="text-gray-600 mb-8">Save items you love to your favorites list and they'll show up here.</p>
            <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors inline-block">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">My Favorites</h1>
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Saved Items ({favorites.length})</h2>
              <button 
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
          >
            {favorites.map((item) => (
              <motion.div 
                key={item._id}
                variants={itemVariants}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={`/products/${item._id}`}>
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${item._id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors mb-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-indigo-600 font-bold mb-4">${item.price.toFixed(2)}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    >
                      <FiShoppingCart className="mr-2" /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromFavorites(item._id)}
                      className="p-2 text-gray-400 hover:text-red-600 border border-gray-300 rounded-md hover:border-red-300 transition-colors"
                      aria-label="Remove from favorites"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 