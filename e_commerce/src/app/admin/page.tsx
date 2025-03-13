'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

export default function AdminIndex() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      router.push('/admin/dashboard');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="mx-auto flex items-center justify-center h-16 w-16 text-indigo-600"
        >
          <FiLoader className="h-12 w-12" />
        </motion.div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Welcome to StyleHub Admin
        </h2>
        <p className="mt-2 text-gray-600">
          Redirecting to dashboard...
        </p>
      </motion.div>
    </div>
  );
} 