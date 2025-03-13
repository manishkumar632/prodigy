'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiCreditCard } from 'react-icons/fi';
import { useCart } from '@/providers/CartProvider';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);
  
  // Calculate shipping (free over $50)
  const shipping = subtotal > 50 ? 0 : 5.99;
  
  // Calculate tax (8.25%)
  const tax = subtotal * 0.0825;
  
  // Calculate total
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/checkout/success');
    }, 2000);
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

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-indigo-600 mb-4">
              <FiShoppingBag className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors inline-block">
              Continue Shopping
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
          <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Continue Shopping
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Cart Items ({cartItems.length})</h2>
                  <button 
                    onClick={() => {
                      clearCart();
                      toast.success('Cart cleared');
                    }}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="divide-y">
                {cartItems.map((item) => (
                  <motion.div 
                    key={`${item._id}-${item.size}-${item.color}`}
                    variants={itemVariants}
                    className="p-6 flex flex-col sm:flex-row gap-4"
                  >
                    <div className="sm:w-24 sm:h-24 relative">
                      <Link href={`/products/${item._id}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-md"
                        />
                      </Link>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <Link href={`/products/${item._id}`}>
                            <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="mt-1 text-sm text-gray-500">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span className="ml-4">Size: {item.size}</span>}
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-md w-32">
                          <button
                            onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}
                            className="px-3 py-1 text-gray-600 hover:text-indigo-600"
                            disabled={(item.quantity || 1) <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                            className="w-full text-center border-0 focus:ring-0"
                          />
                          <button
                            onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
                            className="px-3 py-1 text-gray-600 hover:text-indigo-600"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8.25%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-indigo-600">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-3 px-4 rounded-md flex items-center justify-center ${
                  isCheckingOut 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white transition-colors`}
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCreditCard className="mr-2" /> Proceed to Checkout
                  </>
                )}
              </button>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">We Accept</h3>
                <div className="flex space-x-2">
                  <div className="bg-gray-100 rounded p-2">
                    <Image src="/visa.svg" alt="Visa" width={40} height={25} />
                  </div>
                  <div className="bg-gray-100 rounded p-2">
                    <Image src="/mastercard.svg" alt="Mastercard" width={40} height={25} />
                  </div>
                  <div className="bg-gray-100 rounded p-2">
                    <Image src="/amex.svg" alt="American Express" width={40} height={25} />
                  </div>
                  <div className="bg-gray-100 rounded p-2">
                    <Image src="/paypal.svg" alt="PayPal" width={40} height={25} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 