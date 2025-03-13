'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'men',
    name: "Men's Collection",
    description: 'Stylish and comfortable clothing for men',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    link: '/men',
  },
  {
    id: 'women',
    name: "Women's Collection",
    description: 'Elegant and trendy clothing for women',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    link: '/women',
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background with animation */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-indigo-50" />
        
        {/* Animated decorative elements */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-indigo-500 filter blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-pink-500 filter blur-3xl"
        />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M0 0h20L0 20z"/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '20px 20px'
          }}
        />
      </motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-3xl font-bold mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Shop by Category
        </motion.h2>
        
        <motion.p
          className="text-gray-600 text-center mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Explore our curated collections for men and women, featuring the latest trends and timeless classics
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-lg overflow-hidden group shadow-lg"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                style={{ objectFit: 'cover' }}
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/60 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                <p className="text-lg mb-6 text-center">{category.description}</p>
                <Link
                  href={category.link}
                  className="bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 