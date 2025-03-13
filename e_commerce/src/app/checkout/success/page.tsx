'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShoppingBag, FiHome } from 'react-icons/fi';
import confetti from 'canvas-confetti';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  
  // Trigger confetti effect on page load
  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window !== 'undefined') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(confettiInterval);
          return;
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Launch confetti from both sides
        confetti({
          particleCount: Math.floor(randomInRange(particleCount / 2, particleCount)),
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 0 },
          colors: ['#4F46E5', '#818CF8', '#C7D2FE', '#E0E7FF']
        });
        
        confetti({
          particleCount: Math.floor(randomInRange(particleCount / 2, particleCount)),
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 1 },
          colors: ['#4F46E5', '#818CF8', '#C7D2FE', '#E0E7FF']
        });
      }, 250);
      
      return () => clearInterval(confettiInterval);
    }
  }, []);
  
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background with animation */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-indigo-50" />
        
        {/* Animated decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-green-500 filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-indigo-500 filter blur-3xl"
        />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 relative z-10"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <FiCheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Order Confirmed!</h1>
          
          <p className="mt-2 text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          <div className="mt-6 border border-gray-200 rounded-md p-4 bg-gray-50">
            <h2 className="text-sm font-medium text-gray-700">Order Details</h2>
            <p className="mt-2 text-sm text-gray-600">Order Number: <span className="font-medium">{orderNumber}</span></p>
            <p className="mt-1 text-sm text-gray-600">Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
          </div>
          
          <p className="mt-6 text-sm text-gray-600">
            We've sent a confirmation email with details of your order.
            You can also track your order status in your account.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link 
              href="/"
              className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiHome className="mr-2" /> Return to Home
            </Link>
            
            <Link 
              href="/men"
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiShoppingBag className="mr-2" /> Continue Shopping
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 